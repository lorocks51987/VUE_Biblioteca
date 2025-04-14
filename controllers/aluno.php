<?php

class Aluno extends Controller
{

    function __construct()
    {
        parent::__construct();
        $this->view->js = array();
        $this->view->css = array();
    }

    function index()
    {
        $this->view->title = "Cadastro de Usuário";
        /*Os array push devem ser feitos antes de instanciar o header e footer.*/
        array_push($this->view->js, "views/aluno/app.vue.js");
        array_push($this->view->css, "views/aluno/app.vue.css");
        $this->view->render('header');
        $this->view->render('footer');
    }
    function addAluno()
    {
        $this->model->addAluno();
    }
    function getAluno()
    {
        $this->model->getAluno();
    }
}
