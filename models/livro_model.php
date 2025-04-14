<?php
class Livro_Model extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function addLivro()
    {
        // Lê os dados da requisição
        $x = json_decode(file_get_contents('php://input'));

        // Verifica se os dados necessários estão presentes
        if (!$x || !isset($x->codigo) || !isset($x->ISBN) || !isset($x->Titulo) || !isset($x->Edicao) || !isset($x->Valor) || !isset($x->Autor)) {
            header('Content-Type: application/json');
            echo json_encode(["codigo" => 0, "texto" => "Dados inválidos."]);
            return;
        }

        // Atribui os valores das variáveis
        $codigo = $x->codigo; // Supondo que 'codigo' é o código do livro
        $isbn = $x->ISBN;
        $titulo = $x->Titulo;
        $edicao = $x->Edicao;
        $valor = $x->Valor;
        $autor = $x->Autor;

        // Verifica se o código já existe
        $sqlCheck = "SELECT COUNT(*) FROM biblioteca.livro WHERE codigo = :par_codigo";
        $stmtCheck = $this->db->prepare($sqlCheck);
        $stmtCheck->execute([":par_codigo" => $codigo]);
        $existe = $stmtCheck->fetchColumn();

        if ($existe > 0) {
            header('Content-Type: application/json');
            echo json_encode(["codigo" => 0, "texto" => "Código já cadastcodigodo no sistema."]);
            return;
        }

        // Insere o novo livro
        $sql = "INSERT INTO biblioteca.livro (codigo, isbn, titulo, edicao, valor, autor) VALUES (:par_codigo, :par_isbn, :par_titulo, :par_edicao, :par_valor, :par_autor)";
        $stmt = $this->db->prepare($sql);
        $dados = [
            ":par_codigo" => $codigo,
            ":par_isbn" => $isbn,
            ":par_titulo" => $titulo,
            ":par_edicao" => $edicao,
            ":par_valor" => $valor,
            ":par_autor" => $autor
        ];

        $result = $stmt->execute($dados);

        // Retorna a resposta em JSON
        header('Content-Type: application/json');
        echo json_encode([
            "codigo" => $result ? 1 : 0,
            "texto" => $result ? "Registro inserido com sucesso." : "Erro ao inserir."
        ]);
    }

    public function getAutor()
    {
        $sql = "SELECT codigo, nome as autor FROM biblioteca.autor";
        $stmt = $this->db->prepare($sql);

        try {
            $stmt->execute();
            $autores = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["data" => $autores, "code" => 1]);
        } catch (PDOException $e) {
            header('Content-Type: application/json', true, 500);
            echo json_encode(["codigo" => 0, "texto" => "Erro ao buscar autores: " . $e->getMessage()]);
        }
    }

    public function getLivro()
    {
        $sql = "SELECT distinct l.codigo,	l.isbn, l.titulo, l.edicao, l.valor, a.nome as autor FROM	biblioteca.livro l, biblioteca.autor a WHERE l.autor  = a.codigo;";
        $stmt = $this->db->prepare($sql);

        try {
            $stmt->execute();
            $livros = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["data" => $livros, "code" => 1]);
        } catch (PDOException $e) {
            header('Content-Type: application/json', true, 500);
            echo json_encode(["codigo" => 0, "texto" => "Erro ao buscar autores: " . $e->getMessage()]);
        }
    }
}
