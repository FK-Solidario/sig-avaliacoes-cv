'use client'

import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  ColumnFiltersState,
  RowSelectionState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertTriangle,
  ArrowUpDown,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Settings,
  Download,
  CheckSquare,
  Square,
  Minus
} from 'lucide-react'
import Link from 'next/link'
import { Assessment } from '@/types'

interface DataTableAvaliacoesProps {
  assessments: Assessment[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onSelectAll: () => void
  showSelection?: boolean
  onBulkAction?: (action: string, ids: string[]) => void
  onSelectionChange?: (ids: string[]) => void
}

export function DataTableAvaliacoes({
  assessments,
  selectedIds,
  onSelect,
  onSelectAll,
  showSelection = false,
  onBulkAction,
  onSelectionChange
}: DataTableAvaliacoesProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'parcial':
        return 'bg-green-100 text-green-800'
      case 'grave':
        return 'bg-yellow-100 text-yellow-800'
      case 'total':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const columns: ColumnDef<Assessment>[] = [
    {
      id: 'select',
      header: ({ table }: { table: any }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      ),
      cell: ({ row }: { row: any }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.original.id.toString())}
          onChange={() => onSelect(row.original.id.toString())}
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3"
        >
          Nível de Danos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => (
        <div className="font-mono text-sm">
          #{row.getValue('id')}
        </div>
      ),
    },
    {
      accessorKey: 'titulo',
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Título
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => {
        const assessment = row.original
        return (
          <div className="max-w-[200px]">
            <div className="font-medium truncate">
              {assessment.titulo || `Avaliação ${assessment.id}`}
            </div>
            {assessment.descricao && (
              <div className="text-sm text-gray-500 truncate">
                {assessment.descricao}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'localizacao',
      header: 'Localização',
      cell: ({ row }: { row: any }) => (
        <div className="max-w-[150px] truncate" title={row.getValue('localizacao')}>
          {row.getValue('localizacao') || 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'nivel_danos',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Nível de Dano
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => {
        const severity = row.getValue('nivel_danos') as string
        return severity ? (
          <Badge className={getSeverityColor(severity)}>
            {severity}
          </Badge>
        ) : (
          <span className="text-gray-400">N/A</span>
        )
      },
    },
    {
      accessorKey: 'necessidade_urgente',
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3"
        >
          Necessidades Urgentes
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => (
        <div className="max-w-[200px] truncate" title={row.getValue('necessidade_urgente')}>
          {row.getValue('necessidade_urgente') || 'Nenhuma'}
        </div>
      ),
    },
    {
      accessorKey: 'affected_people',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Pessoas
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => (
        <div className="text-center">
          {row.getValue('affected_people') || 0}
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold"
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">
          {formatDate(row.getValue('created_at'))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }: { row: any }) => {
        const assessment = row.original
        return (
          <div className="flex items-center gap-2">
            <Link href={`/avaliacoes/${assessment.id}`}>
              <Button variant="ghost" size="sm" title="Ver detalhes">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/avaliacoes/${assessment.id}/editar`}>
              <Button variant="ghost" size="sm" title="Editar avaliação">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const table = useReactTable({
    data: assessments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater: any) => {
      setRowSelection(updater)
      if (onSelectionChange) {
        const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater
        const selectedIds = Object.keys(newSelection).filter(key => newSelection[key])
        onSelectionChange(selectedIds)
      }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="space-y-4">
      {/* Barra de ferramentas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedCount} selecionada{selectedCount !== 1 ? 's' : ''}
              </span>
              {onBulkAction && (
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onBulkAction('export', Object.keys(rowSelection))}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onBulkAction('delete', Object.keys(rowSelection))}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Colunas
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column: any) => column.getCanHide())
              .map((column: any) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={selectedIds.includes(row.original.id.toString()) ? 'bg-blue-50' : 'hover:bg-gray-50'}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  Nenhuma avaliação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s)
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <div className="text-sm text-gray-600">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}