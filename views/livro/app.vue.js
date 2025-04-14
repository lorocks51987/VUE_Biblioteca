const AppTemplate = /*html*/ `
<div class="control-section" style="margin-top: 5%">
    <div align='center'>
    <h2 style="text-align: center; margin-bottom: 30px; font-size: px; color: #333;">Cadastrar Livros</h2>
        <div class="row" style="display: flex; justify-content: center;">
            <div class="col-md-4">
                <ejs-textbox ref="codigo" cssClass="e-outline" floatLabelType="Auto" v-model="codigo" placeholder="Código do Livro"></ejs-textbox>
            </div>
            <div class="col-md-4">
                <ejs-textbox ref="ISBN" cssClass="e-outline" floatLabelType="Auto" v-model="ISBN" placeholder="ISBN"></ejs-textbox>
            </div>
            <div class="col-md-4">
                <ejs-textbox ref="Titulo" cssClass="e-outline" floatLabelType="Auto" v-model="Titulo" placeholder="Título"></ejs-textbox>
            </div>
        </div>
        <br>
        <div class="row" style="display: flex; justify-content: center; margin-top: 20px;">
            <div class="col-md-4">
                <ejs-textbox ref="Edicao" cssClass="e-outline" floatLabelType="Auto" v-model="Edicao" placeholder="Edição"></ejs-textbox>
            </div>
            <div class="col-md-4">
                <ejs-textbox ref="Valor" cssClass="e-outline" floatLabelType="Auto" v-model="Valor" placeholder="Valor"></ejs-textbox>
            </div>
            <div class="col-md-4">
                <ejs-dropdownlist
                    ref="Autor"
                    v-model="ListAutor"
                    :dataSource="autores"
                    :fields="{ text: 'autor', value: 'codigo' }"
                    floatLabelType="Auto"
                    cssClass="e-outline"
                    placeholder="Selecione o Autor">
                </ejs-dropdownlist>
            </div>
        </div>
        <div class="row" style="margin-top: 20px; display: flex; justify-content: center;">
            <div class="col-md-4">
                <ejs-button v-on:click.native="addLivro" cssClass="e-outline">Salvar</ejs-button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <ejs-grid 
                    ref="grid"
                    :dataSource="dataSource"
                    :allowPaging="true"
                    :allowSorting="true"
                    :pageSettings="{ pageSizes: true, pageSize: 12 }"
                    :searchSettings="{ ignoreCase: true, ignoreAccent: true }"
                    height="600"
                >
                    <e-columns>
                        <e-column field="codigo" headerText="Código" width="200"></e-column>
                        <e-column field="isbn" headerText="ISBN" width="250"></e-column>
                        <e-column field="titulo" headerText="Título" width="150"></e-column>
                        <e-column field="edicao" headerText="Edição" width="180"></e-column>
                        <e-column field="valor" headerText="Valor" width="150"></e-column>
                        <e-column field="autor" headerText="Autor" width="150"></e-column>
                    </e-columns>
                </ejs-grid>
            </div>
        </div>
    </div>
</div>
`;

Vue.component('AppVue', {
    template: AppTemplate,
    data: function () {
        return {
            codigo: null,
            ISBN: '',
            Titulo: '',
            Edicao: '',
            Valor: '',
            ListAutor: null,
            dataSource: [],
            autores: []
        };
    },
    methods: {
        async getAutor() {
            try {
                let res = await axios.post(BASE + "/livro/getAutor");
                this.autores = res.data.data;
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao carregar autores',
                    text: e.message
                });
            }
        },

        async getLivro() {
            try {
                let res = await axios.post(BASE + "/livro/getLivro");
                this.dataSource = res.data.data; // Corrigido: agora salva os livros na dataSource
            } catch (e) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao carregar livros',
                    text: e.message
                });
            }
        },

        addLivro() {
            if (!this.codigo || !this.Titulo || !this.ISBN || !this.Edicao || !this.Valor || !this.ListAutor) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos obrigatórios',
                    text: 'Por favor, preencha todos os campos.'
                });
                return;
            }

            let dados = {
                codigo: this.codigo,
                ISBN: this.ISBN,
                Titulo: this.Titulo,
                Edicao: this.Edicao,
                Valor: this.Valor,
                Autor: this.ListAutor
            };

            axios.post(BASE + "/livro/addLivro", dados)
                .then(res => {
                    Swal.fire({
                        icon: res.data.codigo === 1 ? 'success' : 'info',
                        title: 'Mensagem',
                        text: res.data.texto
                    });

                    if (res.data.codigo === 1) {
                        // Limpa os campos
                        this.codigo = null;
                        this.ISBN = '';
                        this.Titulo = '';
                        this.Edicao = '';
                        this.Valor = '';
                        this.ListAutor = null;

                        // Atualiza a tabela
                        this.getLivro();
                    }
                })
                .catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ao adicionar livro',
                        text: err.message
                    });
                });
        }
    },
    mounted() {
        this.getAutor();
        this.getLivro();
    }
});
