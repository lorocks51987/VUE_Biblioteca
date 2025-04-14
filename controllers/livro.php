<?php

class Livro extends Controller
{

    function __construct()
    {
        parent::__construct();
        $this->view->js = array();
        $this->view->css = array();
    }

    function index()
    {
        $this->view->title = "Cadastro de Livro";
        /*Os array push devem ser feitos antes de instanciar o header e footer.*/
        array_push($this->view->js, "views/livro/app.vue.js");
        array_push($this->view->css, "views/livro/app.vue.css");
        $this->view->render('header');
        $this->view->render('footer');
    }

    function addLivro()
    {
        $this->model->addLivro();
    }
    function getAutor()
    {
        $this->model->getAutor();
    }
    function getLivro()
    {
        $this->model->getLivro();
    }
}
