interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Carregando..." }: LoadingProps) {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <p className="mt-4 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  message?: string;
}

export function ErrorMessage({
  message = "Ocorreu um erro ao carregar os dados.",
}: ErrorMessageProps) {
  return (
    <div className="rounded-xl bg-red-50 p-6 text-center">
      <div className="text-4xl">⚠️</div>

      <h2 className="mt-3 text-lg font-bold text-red-700">Ocorreu um erro</h2>

      <p className="mt-2 text-sm text-red-600">{message}</p>
    </div>
  );
}
