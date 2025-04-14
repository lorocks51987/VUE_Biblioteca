<?php

class Emprestimo extends Controller
{

    function __construct()
    {
        parent::__construct();
        $this->view->js = array();
        $this->view->css = array();
    }

    function index()
    {
        $this->view->title = "Cadastro de Emprestimo";
        /*Os array push devem ser feitos antes de instanciar o header e footer.*/
        array_push($this->view->js, "views/emprestimo/app.vue.js");
        array_push($this->view->css, "views/emprestimo/app.vue.css");
        $this->view->render('header');
        $this->view->render('footer');
    }
    function getLivro()
    {
        $this->model->getLivro();
    }
    function getAluno()
    {
        $this->model->getAluno();
    }
    function addEmprestimo()
    {
        $this->model->addEmprestimo();
    }
}
