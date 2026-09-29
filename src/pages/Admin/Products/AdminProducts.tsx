import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { toast } from "react-toastify";

import {
  ErrorMessage,
  Loading,
} from "../../../components/Feedback/ErrorMessage";
import { GET_ADMIN_PRODUCTS } from "../../../graphql/queries/adminProducts";
import { GET_CATEGORIES } from "../../../graphql/queries/categories";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} from "../../../graphql/mutations/adminProduct";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  categoryId: string;
  category?: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

interface FormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  categoryId: "",
};

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function AdminProducts() {
  const products = useQuery<{ products: Product[] }>(GET_ADMIN_PRODUCTS);
  const categories = useQuery<{ categories: Category[] }>(GET_CATEGORIES);

  const refetchQueries = [{ query: GET_ADMIN_PRODUCTS }];
  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    refetchQueries,
  });
  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries,
  });
  const [deleteProduct] = useMutation(DELETE_PRODUCT, { refetchQueries });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const saving = creating || updating;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      stock: String(p.stock),
      categoryId: p.categoryId,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const price = Number(form.price.replace(",", "."));
    const stock = Number.parseInt(form.stock, 10);

    if (
      !form.name.trim() ||
      !(price > 0) ||
      !(stock >= 0) ||
      !form.categoryId
    ) {
      toast.error("Preencha nome, preço (> 0), estoque (>= 0) e categoria.");
      return;
    }

    const base = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price,
      stock,
      categoryId: form.categoryId,
    };

    try {
      if (editingId) {
        await updateProduct({
          variables: { input: { id: editingId, ...base } },
        });
        toast.success("Produto atualizado!");
      } else {
        await createProduct({ variables: { input: base } });
        toast.success("Produto criado!");
      }
      reset();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar produto.",
      );
    }
  }

  async function handleDelete(p: Product) {
    if (!window.confirm(`Excluir "${p.name}"?`)) return;
    try {
      await deleteProduct({ variables: { id: p.id } });
      toast.success("Produto excluído.");
      if (editingId === p.id) reset();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao excluir produto.",
      );
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Administração de produtos
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-xl bg-white p-6 shadow sm:grid-cols-2"
        >
          <h2 className="text-xl font-semibold text-gray-900 sm:col-span-2">
            {editingId ? "Editar produto" : "Novo produto"}
          </h2>

          <label className="text-sm text-gray-700 sm:col-span-2">
            Nome
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </label>

          <label className="text-sm text-gray-700 sm:col-span-2">
            Descrição
            <textarea
              rows={3}
              className={inputClass}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>

          <label className="text-sm text-gray-700">
            Preço (R$)
            <input
              inputMode="decimal"
              className={inputClass}
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </label>

          <label className="text-sm text-gray-700">
            Estoque
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
            />
          </label>

          <label className="text-sm text-gray-700 sm:col-span-2">
            Categoria
            <select
              className={inputClass}
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              <option value="">Selecione...</option>
              {categories.data?.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? "Salvando..."
                : editingId
                  ? "Salvar alterações"
                  : "Criar produto"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <section className="overflow-x-auto rounded-xl bg-white shadow">
          {products.loading ? (
            <Loading message="Carregando produtos..." />
          ) : products.error ? (
            <ErrorMessage message="Não foi possível carregar os produtos." />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Estoque</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.data?.products.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.category?.name ?? "-"}
                    </td>
                    <td className="px-4 py-3">{money.format(p.price)}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="mr-3 font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        className="font-semibold text-red-600 hover:text-red-700"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
