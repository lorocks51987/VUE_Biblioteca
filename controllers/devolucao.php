<?php

class Devolucao extends Controller
{

    function __construct()
    {
        parent::__construct();
        $this->view->js = array();
        $this->view->css = array();
    }

    function index()
    {
        $this->view->title = "Cadastro de Devolução";
        /*Os array push devem ser feitos antes de instanciar o header e footer.*/
        array_push($this->view->js, "views/devolucao/app.vue.js");
        array_push($this->view->css, "views/devolucao/app.vue.css");
        $this->view->render('header');
        $this->view->render('footer');
    }
    function getLivro()
    {
        $this->model->getLivro();
    }
    function addDevolucao()
    {
        $this->model->addDevolucao();
    }
    function verificarMulta()
    {
        $this->model->verificarMulta();
    }
}
