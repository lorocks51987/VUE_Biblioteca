<?php

class Autor_Model extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function addAutor()
    {
        $x = json_decode(file_get_contents('php://input'));

        if (!$x || !isset($x->codigo) || !isset($x->nome)) {
            exit(json_encode(["codigo" => 0, "texto" => "Dados inválidos."]));
        }

        $codigo = $x->codigo;
        $nome = $x->nome;

        $sqlCheck = "SELECT COUNT(*) FROM biblioteca.autor WHERE codigo = :par_codigo";
        $stmtCheck = $this->db->prepare($sqlCheck);
        $stmtCheck->execute([":par_codigo" => $codigo]);
        $existe = $stmtCheck->fetchColumn();

        if ($existe > 0) {
            exit(json_encode(["codigo" => 0, "texto" => "Código já cadastrado no sistema."]));
        }

        $sql = "INSERT INTO biblioteca.autor (codigo, nome) VALUES (:par_codigo, :par_nome)";
        $stmt = $this->db->prepare($sql);
        $dados = [":par_codigo" => $codigo, ":par_nome" => $nome];

        $result = $stmt->execute($dados);

        header('Content-Type: application/json');
        echo json_encode([
            "codigo" => $result ? 1 : 0,
            "texto" => $result ? "Registro inserido com sucesso." : "Erro ao inserir."
        ]);
    }

    public function getAutor()
    {
        try {
            $result = $this->db->select("SELECT codigo, nome FROM biblioteca.autor");

            header('Content-Type: application/json');
            echo json_encode(["codigo" => 1, "autor" => $result]); // corrigido aqui (autor com "a" minúsculo)
        } catch (PDOException $e) {
            exit(json_encode(["codigo" => 0, "texto" => "Erro no banco de dados: " . $e->getMessage()]));
        }
    }
}
