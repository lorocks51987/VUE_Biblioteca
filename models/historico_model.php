<?php
class Historico_Model extends Model
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getHistorico()
    {
        $post = json_decode(file_get_contents('php://input'));

        $result = $this->db->select("SELECT
        CONCAT(a.ra, ' - ', a.nome) AS aluno,
        CONCAT(l.codigo, ' - ', l.titulo) AS livro,
        DATE_FORMAT(e.`data`, '%d/%m/%Y') AS `data`,
        DATE_FORMAT(e2.dataprevistadev, '%d/%m/%Y') AS `dataprevistadev`,
        IFNULL(
            (
                SELECT CONCAT('Devolvido em: ', DATE_FORMAT(d.datadevolucao, '%d/%m/%Y'))
                FROM biblioteca.devolucao d 
                WHERE d.emprestimo = e.numero 
                LIMIT 1
            ),
            'Não devolvido'
        ) AS status
    FROM
        biblioteca.emprestimo e,
        biblioteca.aluno a,
        biblioteca.emprestimolivro e2,
        biblioteca.livro l
    WHERE
        e.ra = a.ra
        AND e2.emprestimo = e.numero
        AND e2.livro = l.codigo
    ORDER BY 
        status DESC;
");


        if (count($result) > 0) {
            exit(json_encode([
                "code" => 1,
                "msg" => "Busca realizada com sucesso.",
                "dados" => $result
            ]));
        } else {
            exit(json_encode([
                "code" => 0,
                "msg" => "Não foi possível encontrar nenhum registro."
            ]));
        }
    }
}
