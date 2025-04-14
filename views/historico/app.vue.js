const AppTemplate = /*html*/ `
  <div class="control-section" style="min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; padding: 40px 0; background-color: #f9f9f9;">
    <div style="background: #fff; padding: 40px; border-radius: 20px; box-shadow: 0 0 30px rgba(0,0,0,0.1); width: 95%; max-width: 1500px;">
      <h2 style="text-align: center; margin-bottom: 30px; font-size: px; color: #333;">Histórico de Empréstimos</h2>
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
              <e-column field="aluno" headerText="Aluno" width="200"></e-column>
              <e-column field="livro" headerText="Livro" width="250"></e-column>
              <e-column field="data" headerText="Data do Empréstimo" width="150"></e-column>
              <e-column field="dataprevistadev" headerText="Data para Devolução" width="180"></e-column>
              <e-column field="status" headerText="Status" width="150"></e-column>
            </e-columns>
          </ejs-grid>
        </div>
      </div>
    </div>
  </div>
`;

Vue.component("AppVue", {
  template: AppTemplate,
  data: function () {
    return {
      dataSource: []
    };
  },
  methods: {
    async getHistorico() {
      try {
        const res = await axios.post(BASE + "/historico/getHistorico");
        this.dataSource = res.data.dados;
      } catch (e) {
        Swal.fire("Erro", "Erro ao carregar empréstimos.", "error");
      }
    }
  },
  mounted() {
    this.getHistorico();
  }
});
