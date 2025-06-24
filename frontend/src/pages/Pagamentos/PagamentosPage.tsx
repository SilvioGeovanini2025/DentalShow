import { useState, useEffect } from "react";
import { getPagamentos } from "../../services/pagamentos";
import type { Pagamento } from "../../services/pagamentos";
import ListPagamentos from "./ListPagamentos";
import FormPagamento from "./FormPagamento";

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [editPagamento, setEditPagamento] = useState<Pagamento | null>(null);

  const fetchPagamentos = async () => {
    const res = await getPagamentos();
    setPagamentos(res.data);
  };

  useEffect(() => {
    fetchPagamentos();
  }, []);

  const handleSuccess = () => {
    setEditPagamento(null);
    fetchPagamentos();
  };

  const handleCancel = () => {
    setEditPagamento(null);
  };

  return (
    <div>
      <FormPagamento
        pagamento={editPagamento}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
      <ListPagamentos
        pagamentos={pagamentos}
        setEdit={setEditPagamento}
        refreshList={fetchPagamentos}
      />
    </div>
  );
}
