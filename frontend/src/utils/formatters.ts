export function formatarValorBRL(valor: number | string): string {
  if (typeof valor === "string") valor = parseFloat(valor.replace(",", "."));
  if (isNaN(valor)) return "0,00";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
