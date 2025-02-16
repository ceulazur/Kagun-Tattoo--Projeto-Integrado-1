class SessaoIterator {
    constructor(sessoes, filtros) {
        this.sessoes = sessoes;
        this.index = 0;
        this.filtros = filtros;
    }

    temProximo() {
        while (this.index < this.sessoes.length) {
            const sessao = this.sessoes[this.index];

            if (this.filtrar(sessao)) return true;

            this.index++;
        }
        return false;
    }

    proximo() {
        if (this.temProximo()) return this.sessoes[this.index++];

        return null;
    }

    filtrar(sessao) {
        // Filtra por status
        if (this.filtros.status && sessao.status !== this.filtros.status) return false;

        // Filtra por período (já vem processado pelo paginatorMiddleware)
        if (this.filtros.dataHorario) {
            const dataSessao = new Date(sessao.dataHorario);
            if (dataSessao < this.filtros.dataHorario.gte || dataSessao >= this.filtros.dataHorario.lt)
                return false;
        }

        return true; // Se passou por todos os filtros, retorna true
    }
}

export default SessaoIterator;
