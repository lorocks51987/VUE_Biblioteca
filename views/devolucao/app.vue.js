const AppTemplate = /*html*/ `
  <div class="control-section" style="margin-top: 10%; display: flex; justify-content: center;">
    <div style="background: #fff; padding: 30px; border-radius: 20px; box-shadow: 0 0 20px rgba(0,0,0,0.1); width: 90%; max-width: 900px;">
      <h2 style="text-align: center; margin-bottom: 30px;">Selecione o Livro para Devolver</h2>

      <div class="form-grid" style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
        <div style="flex: 1 1 250px;">
          <ejs-dropdownlist
            ref="livro"
            v-model="livroSelecionado"
            :dataSource="livros"
            :fields="{ text: 'livro', value: 'codigo' }"
            floatLabelType="Auto"
            cssClass="e-outline"
            placeholder="Selecione o Livro"
          ></ejs-dropdownlist>
        </div>
      </div>

      <div style="margin-top: 30px; text-align: center;">
        <p style="color: #ff4d4d; font-weight: 500; margin-bottom: 15px;">
          O livro deve ser devolvido em até 30 dias. Após esse prazo, será aplicada uma multa de R$ 1,15 por dia de atraso.
        </p>
        <ejs-button :disabled="loading" v-on:click.native="verificarMulta" cssClass="e-outline" style="padding: 10px 30px;">
          {{ loading ? 'Verificando...' : 'Salvar' }}
        </ejs-button>
      </div>
    </div>
  </div>
`;

Vue.component("AppVue", {
  template: AppTemplate,
  data: function () {
    return {
      livroSelecionado: null,
      livros: [],
      loading: false
    };
  },
  methods: {
    async getLivros() {
      try {
        const res = await axios.post(BASE + "/devolucao/getlivro");
        this.livros = res.data.data;
      } catch (e) {
        Swal.fire("Erro", "Erro ao obter livros.", "error");
      }
    },

    async verificarMulta() {
      if (!this.livroSelecionado) {
        Swal.fire("Atenção", "Por favor, selecione um livro.", "warning");
        return;
      }

      this.loading = true;

      try {
        const res = await axios.post(BASE + "/devolucao/verificarMulta", {
          livro: this.livroSelecionado
        });

        if (res.data.codigo === 1) {
          const multa = parseFloat(res.data.multa);
          const emprestimo = res.data.emprestimo;
          const diasAtraso = parseInt(res.data.dias || 0);

          if (multa > 0) {
            const confirmacao = await Swal.fire({
              title: "Multa Aplicada",
              text: `O livro está com ${(diasAtraso - 30)} dia(s) de atraso.\nA multa total é de R$ ${((diasAtraso - 30) * 1.15).toFixed(2)}.\nDeseja registrar a devolução mesmo assim?`,
              icon: "warning",
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: "Registrar",
              denyButtonText: "Pagar",
              cancelButtonText: "Cancelar"
            });

            if (confirmacao.isConfirmed) {
              await this.addDevolucao(emprestimo, (diasAtraso - 30) * 1.15);
            } else if (confirmacao.isDenied) {
              Swal.fire("Pagamento", "Redirecionando para o pagamento...", "info");
              // Adicione aqui redirecionamento ou lógica de pagamento
            }
          } else {
            await this.addDevolucao(emprestimo, 0);
          }
        } else {
          Swal.fire("Erro", res.data.texto, "error");
        }
      } catch (err) {
        Swal.fire("Erro", "Erro ao verificar multa.", "error");
      } finally {
        this.loading = false;
      }
    },

    async addDevolucao(emprestimo, multa) {
      this.loading = true;

      try {
        const res = await axios.post(BASE + "/devolucao/addDevolucao", {
          livro: this.livroSelecionado,
          emprestimo: emprestimo,
          multa: multa
        });

        if (res.data.codigo === 1) {
          Swal.fire("Sucesso", "Devolução registrada com sucesso!", "success");
          this.livroSelecionado = null;
          this.getLivros();
        } else {
          Swal.fire("Aviso", res.data.texto, "warning");
        }
      } catch (err) {
        Swal.fire("Erro", "Erro ao registrar devolução.", "error");
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.getLivros();
  }
});
