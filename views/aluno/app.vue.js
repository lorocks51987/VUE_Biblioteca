const AppTemplate = /*html*/ `
<div class="control-section" style="margin-top: 10%">
    <div align='center'>
    <h2 style="text-align: center; margin-bottom: 30px; font-size: px; color: #333;">Cadastrar Alunos</h2>
        <div class="row" style="display: flex;justify-content: center;">
            <div class="col-md-4">
                <ejs-textbox ref="ra" cssClass="e-outline" floatLabelType="Auto" v-model="ra" placeholder="RA do Aluno"></ejs-textbox>
            </div>
            <div class="col-md-4">
                <ejs-textbox ref="nome" cssClass="e-outline" floatLabelType="Auto" v-model="nome" placeholder="Nome do Aluno"></ejs-textbox>
            </div>
        </div>
        <div class="row" style="margin-top: 20px; display: flex;justify-content: center;">
            <div class="col-md-4">
                <ejs-button v-on:click.native="addAluno" cssClass="e-outline">Salvar</ejs-button>
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
              <e-column field="ra" headerText="RA" width="500"></e-column>
              <e-column field="aluno" headerText="Nome do Aluno" width="500"></e-column>
            </e-columns>
          </ejs-grid>
    </div>
</div>
`;

Vue.component('AppVue', {
    template: AppTemplate,
    data: function () {
        return {
            ra: null,
            nome: '',
            dataSource: [],
        };
    },
    mounted() {
        this.getAluno(); // carrega os dados na montagem do componente
    },
    methods: {
        async getAluno() {
            try {
                const res = await axios.post(BASE + "/aluno/getAluno");
                this.dataSource = res.data.alunos; // corrigido aqui
            } catch (e) {
                Swal.fire("Erro", "Erro ao carregar aluno.", "error");
            }
        },
        addAluno: function () {
            if (!this.ra || !this.nome) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos obrigatórios',
                    text: 'Por favor, preencha todos os campos.'
                });
                return;
            }

            axios.post(BASE + "/aluno/addAluno", { "ra": this.ra, "nome": this.nome })
                .then(res => {
                    Swal.fire({
                        icon: res.data.codigo === 1 ? 'success' : 'info',
                        title: 'Mensagem',
                        text: res.data.texto
                    });

                    if (res.data.codigo === 1) {
                        this.ra = null;
                        this.nome = '';
                        this.getAluno(); // atualiza a lista após cadastro
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
    }
});
