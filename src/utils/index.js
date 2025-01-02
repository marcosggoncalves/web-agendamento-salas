import moment from 'moment';
import router from "@/router/index";
import 'moment/locale/pt-br';

export const formatData = (valorFormatar, tipoFormatacaoRecebido = "YYYY-MM-DD", tipoFormatacao = "DD/MM/YYYY") => {
  return moment(valorFormatar, tipoFormatacaoRecebido).format(tipoFormatacao);
}

export const filtrarDatasFuturas = (horarios, date) => {
  const dataAtual = moment()
  const dataComparacao = moment(date, "YYYY-MM-DD HH:mm"); 

  return horarios?.filter((item) => {

    const inicialCompleta = moment(`${dataComparacao.format("YYYY-MM-DD")} ${item.inicial}`, "YYYY-MM-DD HH:mm");
    const finalCompleta = moment(`${dataComparacao.format("YYYY-MM-DD")} ${item.final}`, "YYYY-MM-DD HH:mm");

    if (dataAtual.isSameOrAfter(dataComparacao)) {
      return (
        inicialCompleta.isSameOrAfter(dataComparacao) &&
        finalCompleta.isSameOrAfter(dataComparacao)
      );
    }
    return true;
  });
};

export const urlQrcode = (hash) => {
  return `${window.location.origin}/agendamento-sala/${hash}`;
};

export const getUrl = (hash) => {
 return  router.push(`/agendamento-sala/${hash}` );
};
