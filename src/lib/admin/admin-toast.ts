import { toast } from "sonner"

async function extractErrorMessage(response: Response): Promise<string> {
  const body = await response.json()
  if (typeof body.detail === "string") return body.detail
  if (Array.isArray(body.detail)) {
    return body.detail
      .map((item: { msg?: string }) => item.msg)
      .filter(Boolean)
      .join(", ")
  }

  return "Não foi possível concluir a operação."
}

export const adminToast = {
  success(message: string) { toast.success(message) },
  error(message: string) { toast.error(message) },
  info(message: string) { toast.info(message) },

  async fromResponse(response: Response, fallback = "Não foi possível concluir a operação.") {
    const message = response.ok ? fallback : await extractErrorMessage(response)
    if (response.ok) { adminToast.success(message) }
    else { adminToast.error(message) }
    return response.ok
  },
}

export async function adminMutation<T>(request: () => Promise<Response>, successMessage: string): Promise<T | null> {
  const response = await request()

  if (!response.ok) {
    adminToast.error(await extractErrorMessage(response))
    return null
  }

  adminToast.success(successMessage)
  return (await response.json()) as T
}
