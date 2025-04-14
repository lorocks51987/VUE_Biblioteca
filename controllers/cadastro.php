<?php

class Cadastro extends Controller
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
        array_push($this->view->js, "views/cadastro/app.vue.js");
        array_push($this->view->css, "views/cadastro/app.vue.css");
        $this->view->render('header');
        $this->view->render('footer');
    }

    function getBoletim()
    {
        $this->model->getBoletim();
    }

}