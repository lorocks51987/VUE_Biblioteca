<?php
class Emprestimo_Model extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function addEmprestimo()
    {
        $x = json_decode(file_get_contents('php://input'));
        $livro = $x->livro;
        $ra = $x->aluno;

        // Verifica o último empréstimo do livro
        $sql = "SELECT emprestimo FROM biblioteca.emprestimolivro 
            WHERE livro = :par_livro 
            ORDER BY emprestimo DESC LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':par_livro' => $livro]);
        $ultimoEmprestimo = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($ultimoEmprestimo) {
            // Verifica se já foi devolvido
            $sql = "SELECT 1 FROM biblioteca.devolucao 
                WHERE emprestimo = :par_emprestimo AND livro = :par_livro";
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':par_emprestimo' => $ultimoEmprestimo['emprestimo'],
                ':par_livro' => $livro
            ]);

            if (!$stmt->fetch()) {
                echo json_encode(["codigo" => 0, "texto" => "Este livro já está emprestado!"]);
                return;
            }
        }

        // Cadastra novo empréstimo
        $sql = "INSERT INTO biblioteca.emprestimo (data, ra) VALUES (CURDATE(), :par_ra)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([":par_ra" => $ra]);
        $emprestimoId = $this->db->lastInsertId();

        // Data de devolução prevista
        $dataDevolucao = date('Y-m-d', strtotime('+30 days'));

        // Cadastra o empréstimo do livro
        $sql = "INSERT INTO biblioteca.emprestimolivro (emprestimo, livro, dataprevistadev)
            VALUES (:par_emprestimo, :par_livro, :par_data)";
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute([
            ":par_emprestimo" => $emprestimoId,
            ":par_livro" => $livro,
            ":par_data" => $dataDevolucao
        ]);

        if (!$result) {
            echo json_encode(["codigo" => 0, "texto" => "Erro ao registrar empréstimo."]);
            return;
        }

        echo json_encode([
            "codigo" => 1,
            "texto" => "Empréstimo registrado com sucesso!",
            "dataDevolucao" => $dataDevolucao
        ]);
    }


    public function getlivro()
    {
        $sql = "SELECT codigo, titulo AS livro FROM biblioteca.livro";
        $stmt = $this->db->prepare($sql);

        try {
            $stmt->execute();
            $livros = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["data" => $livros, "code" => 1]);
        } catch (PDOException $e) {
            header('Content-Type: application/json', true, 500);
            echo json_encode([
                "codigo" => 0,
                "texto" => "Erro ao buscar livros: " . $e->getMessage()
            ]);
        }
    }

    public function getaluno()
    {
        $sql = "SELECT ra AS codigo, CONCAT(ra, ' - ', nome) AS Aluno FROM biblioteca.aluno;";
        $stmt = $this->db->prepare($sql);

        try {
            $stmt->execute();
            $alunos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["data" => $alunos, "code" => 1]);
        } catch (PDOException $e) {
            header('Content-Type: application/json', true, 500);
            echo json_encode([
                "codigo" => 0,
                "texto" => "Erro ao buscar alunos: " . $e->getMessage()
            ]);
        }
    }
}
