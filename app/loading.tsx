export default function Loading() {
  return (
  <div className="flex flex-col items-center justify-center h-80">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
    <div className="mt-4 text-gray-500 text-lg font-medium">Загрузка...</div>
  </div>
  )
}
