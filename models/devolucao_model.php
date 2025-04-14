<?php
class Devolucao_Model extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getlivro()
    {
        $sql = "SELECT
                    l.codigo as codigo,
                    e.numero as emprestimo,
                    CONCAT(l.codigo, ' - ', l.titulo) as livro
                FROM
                    biblioteca.emprestimo e,
                    biblioteca.emprestimolivro e2,
                    biblioteca.livro l
                WHERE
                    e2.emprestimo = e.numero
                    AND e2.livro = l.codigo
                    AND NOT EXISTS (
                        SELECT 1
                        FROM biblioteca.devolucao d
                        WHERE d.emprestimo = e2.emprestimo
                        AND d.livro = e2.livro
                    )";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            $livros = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["data" => $livros, "codigo" => 1]);
        } catch (PDOException $e) {
            echo json_encode([
                "codigo" => 0,
                "texto" => "Erro ao buscar livros: " . $e->getMessage()
            ]);
        }
    }

    public function verificarMulta()
    {
        $x = json_decode(file_get_contents('php://input'));

        if (!isset($x->livro)) {
            echo json_encode(["codigo" => 0, "texto" => "Livro não informado."]);
            return;
        }

        $sql = "SELECT e.numero AS emprestimo, e.data
            FROM biblioteca.emprestimo e, biblioteca.emprestimolivro e2
            WHERE e2.livro = :par_livro
              AND e2.emprestimo = e.numero
            ORDER BY e.numero DESC
            LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':par_livro' => $x->livro]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$resultado) {
            echo json_encode(["codigo" => 0, "texto" => "Empréstimo não encontrado."]);
            return;
        }

        $dataEmprestimo = new DateTime($resultado['data']);
        $dataHoje = new DateTime();
        $dias = $dataEmprestimo->diff($dataHoje)->days;

        $multa = 0;
        if ($dias > 30) {
            $multa = ($dias - 30) * 1.15;
        }

        echo json_encode([
            "codigo" => 1,
            "emprestimo" => $resultado['emprestimo'],
            "dias" => $dias,
            "multa" => $multa
        ]);
    }


    public function addDevolucao()
    {
        $x = json_decode(file_get_contents('php://input'));

        if (!isset($x->livro) || !isset($x->emprestimo) || !isset($x->multa)) {
            echo json_encode(["codigo" => 0, "texto" => "Dados incompletos."]);
            return;
        }

        $sql = "INSERT INTO biblioteca.devolucao (emprestimo, livro, datadevolucao, multa)
                VALUES (:par_emprestimo, :par_livro, :par_data, :par_multa)";

        $stmt = $this->db->prepare($sql);

        try {
            $stmt->execute([
                ':par_emprestimo' => $x->emprestimo,
                ':par_livro' => $x->livro,
                ':par_data' => date('Y-m-d'),
                ':par_multa' => $x->multa
            ]);

            echo json_encode(["codigo" => 1, "texto" => "Devolução registrada com sucesso!"]);
        } catch (PDOException $e) {
            echo json_encode([
                "codigo" => 0,
                "texto" => "Erro ao registrar devolução: " . $e->getMessage()
            ]);
        }
    }
}
