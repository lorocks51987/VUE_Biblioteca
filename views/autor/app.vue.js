const AppTemplate = /*html*/ `
<div class="control-section" style="margin-top: 10%">
    <div align='center'>
    <h2 style="text-align: center; margin-bottom: 30px; color: #333;">Cadastrar Autor</h2>
        <div class="row" style="display: flex;justify-content: center;">
            <div class="col-md-4">
                <ejs-textbox ref="codigo" cssClass="e-outline" floatLabelType="Auto" v-model="codigo" placeholder="Código do autor"></ejs-textbox>
            </div>
            <div class="col-md-4">
                <ejs-textbox ref="nome" cssClass="e-outline" floatLabelType="Auto" v-model="nome" placeholder="Nome do autor"></ejs-textbox>
            </div>
        </div>
        <div class="row" style="margin-top: 20px; display: flex;justify-content: center;">
            <div class="col-md-4">
                <ejs-button v-on:click.native="addAutor" cssClass="e-outline">Salvar</ejs-button>
            </div>
        </div>
        <ejs-grid 
            ref="grid"
            :dataSource="dataSource"
            :allowPaging="true"
            :allowSorting="true"
            :pageSettings="{ pageSizes: true, pageSize: 12 }"
            :searchSettings="{ ignoreCase: true, ignoreAccent: true }"
            height="500"
        >
            <e-columns>
              <e-column field="codigo" headerText="Código do autor" width="500"></e-column>
              <e-column field="nome" headerText="Nome do Autor" width="500"></e-column>
            </e-columns>
        </ejs-grid>
    </div>
</div>
`;

Vue.component('AppVue', {
    template: AppTemplate,
    data: function () {
        return {
            codigo: null,
            nome: '',
            dataSource: [],
        };
    },
    methods: {
        async getAutor() {
            try {
                const res = await axios.post(BASE + "/autor/getAutor");
                this.dataSource = res.data.autor;
            } catch (e) {
                Swal.fire("Erro", "Erro ao carregar autor.", "error");
            }
        },
        addAutor: function () {
            if (!this.codigo || !this.nome) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos obrigatórios',
                    text: 'Por favor, preencha todos os campos.'
                });
                return;
            }

            axios.post(BASE + "/autor/addautor", { "codigo": this.codigo, "nome": this.nome })
                .then(res => {
                    Swal.fire({
                        icon: res.data.codigo === 1 ? 'success' : 'info',
                        title: 'Mensagem',
                        text: res.data.texto
                    });

                    if (res.data.codigo === 1) {
                        this.codigo = null;
                        this.nome = '';
                        this.getAutor(); // atualizar a tabela
                    }
                })
                .catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro na requisição',
                        text: err.message
                    });
                });
        }
    },
    mounted() {
        this.getAutor();
    }
});
