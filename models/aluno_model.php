<?php

require_once("util/param.php");

class Aluno_Model extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function addAluno()
    {
        $x = json_decode(file_get_contents('php://input'));

        if (!$x || !isset($x->ra) || !isset($x->nome)) {
            exit(json_encode(["codigo" => 0, "texto" => "Dados inválidos."]));
        }

        $ra = $x->ra;
        $nome = $x->nome;

        try {
            // 🔍 1. Verifica se o aluno já existe
            $sqlCheck = "SELECT COUNT(*) FROM biblioteca.aluno WHERE ra = :par_ra";
            $stmtCheck = $this->db->prepare($sqlCheck);
            $stmtCheck->execute([":par_ra" => $ra]);
            $existe = $stmtCheck->fetchColumn();

            if ($existe > 0) {
                exit(json_encode(["codigo" => 0, "texto" => "RA já cadastrado no sistema."]));
            }

            // ✅ 2. Se não existir, insere o novo aluno
            $sql = "INSERT INTO biblioteca.aluno (ra, nome) VALUES (:par_ra, :par_nome)";
            $stmt = $this->db->prepare($sql);
            $dados = [":par_ra" => $ra, ":par_nome" => $nome];

            $result = $stmt->execute($dados);

            header('Content-Type: application/json');
            echo json_encode([
                "codigo" => $result ? 1 : 0,
                "texto" => $result ? "Registro inserido com sucesso." : "Erro ao inserir."
            ]);
        } catch (PDOException $e) {
            exit(json_encode(["codigo" => 0, "texto" => "Erro no banco de dados: " . $e->getMessage()]));
        }
    }

    public function getAluno()
    {
        $post = json_decode(file_get_contents('php://input'));

        try {
            $result = $this->db->select("SELECT ra, nome as aluno FROM biblioteca.aluno");

            header('Content-Type: application/json');
            echo json_encode(["codigo" => 1, "alunos" => $result]);
        } catch (PDOException $e) {
            exit(json_encode(["codigo" => 0, "texto" => "Erro no banco de dados: " . $e->getMessage()]));
        }
    }
}
