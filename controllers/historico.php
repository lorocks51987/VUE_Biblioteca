<?php

class Historico extends Controller
{

    function __construct()
    {
        parent::__construct();
        $this->view->js = array();
        $this->view->css = array();
    }

    function index()
    {
        $this->view->title = "Histórico de Empréstimos";
        array_push($this->view->js, "views/historico/app.vue.js");
        array_push($this->view->css, "views/historico/app.vue.css");
        $this->view->render('header');
        $this->view->render('footer');
    }
    function getHistorico()
    {
        $this->model->getHistorico();
    }
}
