const AppTemplate = /*html*/ `
  <div class="control-section" style="margin-top: 10%; display: flex; justify-content: center;">
    <div style="background: #fff; padding: 30px; border-radius: 20px; box-shadow: 0 0 20px rgba(0,0,0,0.1); width: 90%; max-width: 900px;">
      <h2 style="text-align: center; margin-bottom: 30px;">Novo Empréstimo</h2>

      <div class="form-grid" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
        <div style="flex: 1 1 250px;">
          <ejs-dropdownlist ref="livro" v-model="livroSelecionado" :dataSource="livros" :fields="{ text: 'livro', value: 'codigo' }" floatLabelType="Auto" cssClass="e-outline" placeholder="Selecione o Livro"></ejs-dropdownlist>
        </div>
        <div style="flex: 1 1 250px;">
          <ejs-dropdownlist ref="aluno" v-model="alunoSelecionado" :dataSource="alunos" :fields="{ text: 'Aluno', value: 'codigo' }" floatLabelType="Auto" cssClass="e-outline" placeholder="Selecione o Aluno"></ejs-dropdownlist>
        </div>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <p style="color: #ff4d4d; font-weight: 500; margin-bottom: 15px;">
          O livro deve ser devolvido em até 30 dias. Após esse prazo, será aplicada uma multa de R$ 1,15 por dia de atraso.
        </p>
        <ejs-button :disabled="loading" v-on:click.native="addEmprestimo" cssClass="e-outline" style="padding: 10px 30px;">
          {{ loading ? 'Salvando...' : 'Salvar' }}
        </ejs-button>
      </div>
      </div>
    </div>
  </div>
`;

Vue.component("AppVue", {
  template: AppTemplate,
  data: function () {
    return {
      livroSelecionado: null,
      alunoSelecionado: null,
      livros: [],
      alunos: [],
      dataSource: [],
      loading: false
    };
  },
  methods: {
    async getLivros() {
      try {
        const res = await axios.post(BASE + "/emprestimo/getlivro");
        this.livros = res.data.data;
      } catch (e) {
        Swal.fire("Erro", "Erro ao obter livros.", "error");
      }
    },

    async getAlunos() {
      try {
        const res = await axios.post(BASE + "/emprestimo/getaluno");
        this.alunos = res.data.data;
      } catch (e) {
        Swal.fire("Erro", "Erro ao obter alunos.", "error");
      }
    },

    async addEmprestimo() {
      if (!this.livroSelecionado || !this.alunoSelecionado) {
        Swal.fire("Atenção", "Por favor, preencha todos os campos.", "warning");
        return;
      }

      this.loading = true;

      const dados = {
        livro: this.livroSelecionado,
        aluno: this.alunoSelecionado
      };

      try {
        const res = await axios.post(BASE + "/emprestimo/addEmprestimo", dados);
        if (res.data.codigo === 1) {
          Swal.fire("Sucesso", `Empréstimo registrado com sucesso!<br>Data de devolução: <strong>${res.data.dataDevolucao}</strong>`, "success");
          this.livroSelecionado = null;
          this.alunoSelecionado = null;
        } else {
          Swal.fire("Aviso", res.data.texto, "warning");
        }
      } catch (err) {
        Swal.fire("Erro", "Erro ao adicionar empréstimo.", "error");
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.getLivros();
    this.getAlunos();
  }
});
