import { DataTableProps } from "@/_types/DataTableProps";
import { Button, Flex, Input, Stack, Table } from "@chakra-ui/react";
import React from "react";

export function DataTable<T>({
  columns,
  data,
  total,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  searchPlaceholder = "Buscar...",
  renderActions,
  filters,
  loading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (onSearch) onSearch(search);
  }

  return (
    <Flex direction="column" spaceY="4">

      {/* 🔎 Busca */}
      {onSearch && (
        <form onSubmit={handleSearch} className="flex gap-2">
            <Flex w="full">
            <Input
                type="text"
                className="border p-2 rounded w-full"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
            <Button className="bg-blue-600 text-white px-4 py-2 rounded">
                Buscar
            </Button>
            </Flex>
        </form>
      )}

      {/* 🎛️ Filtros dinâmicos */}
      {filters && (
        <Flex w="full" gap="3">
          {filters}
        </Flex>
      )}

      {/* 🧱 Tabela */}
      <Flex className="overflow-auto border rounded">
        <Table.Root className="w-full border-collapse">
          <Table.Header className="bg-gray-100">
            <Table.Row>
              {columns.map((col) => (
                  <Table.ColumnHeader
                    key={String(col.key)}
                    style={{ width: col.width }}
                    className="border p-2 text-left"
                  >
                    {col.label}
                  </Table.ColumnHeader>
              ))}
              {renderActions && (
                  <Table.ColumnHeader className="border p-2 text-left">
                    Ações
                  </Table.ColumnHeader>
                )}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {loading ? (
            <Table.Row>
              <Table.Cell>
                  Carregando...
              </Table.Cell>
              </Table.Row>
            ) : data.length === 0 ? (
               <Table.Row>
              <Table.Cell>
                  Nenhum registro encontrado.
              </Table.Cell>
              </Table.Row>
            ) : (
              data.map((item, index) => (
                <Table.Row key={index}>
                  {columns.map((col) => (
                    <Table.Cell key={String(col.key)} className="p-2 border">
                      {col.render ? col.render(item) : (item[col.key] as any)}
                    </Table.Cell>
                  ))}
                    {renderActions && (
                    <Table.Cell className="p-2 border">
                      {renderActions(item)}
                    </Table.Cell>
                  )}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Flex>

      {/* 📄 Paginação */}
      <Flex direction="column-reverse"  alignItems="center">
        <Stack alignSelf="flex-start">
          Página {currentPage} de {totalPages} — Total: {total}
        </Stack>

        <Flex gap="2" className="flex gap-2" alignSelf="flex-start">
          <Button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Anterior
          </Button>

          <Button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Próxima
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
