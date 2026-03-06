import { Loader2, Search } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LOW_STOCK_THRESHOLD, STATUS_FILTER_OPTIONS } from "./constants";
import ProductStatusBadge from "./ProductStatusBadge";

export default function ProductsSection({
    search,
    onSearchChange,
    onSearchSubmit,
    statusFilter,
    onStatusFilterChange,
    loading,
    products,
    selectedId,
    onSelectProduct,
}) {
    const showTableEmptyState = !loading && products.length === 0;

    return (
        <Card className="gap-4">
            <CardHeader className="space-y-1 pb-0">
                <CardTitle className="text-lg">Lista de produtos</CardTitle>
                <CardDescription>Selecione um item para editar ou desativar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
                <form
                    onSubmit={onSearchSubmit}
                    className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                    <div className="relative">
                        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            value={search}
                            onChange={onSearchChange}
                            placeholder="Buscar por nome, categoria ou slug"
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                        <SelectTrigger className="h-10 w-full sm:w-[170px]">
                            <SelectValue placeholder="Filtrar status" />
                        </SelectTrigger>
                        <SelectContent align="end">
                            {STATUS_FILTER_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type="submit" variant="outline" className="h-10 min-w-24" disabled={loading}>
                        {loading ? <Loader2 className="size-4 animate-spin" /> : "Buscar"}
                    </Button>
                </form>

                <Separator />

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Preço</TableHead>
                                <TableHead>Estoque</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading
                                ? Array.from({ length: 6 }).map((_, index) => (
                                      <TableRow key={`skeleton-${index}`}>
                                          <TableCell>
                                              <Skeleton className="h-4 w-32" />
                                          </TableCell>
                                          <TableCell>
                                              <Skeleton className="h-4 w-20" />
                                          </TableCell>
                                          <TableCell>
                                              <Skeleton className="h-4 w-20" />
                                          </TableCell>
                                          <TableCell>
                                              <Skeleton className="h-4 w-16" />
                                          </TableCell>
                                          <TableCell className="text-right">
                                              <Skeleton className="ml-auto h-4 w-14" />
                                          </TableCell>
                                      </TableRow>
                                  ))
                                : null}

                            {showTableEmptyState ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-10 text-center">
                                        <p className="font-medium">Nenhum produto encontrado</p>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            Ajuste os filtros ou cadastre um novo produto.
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : null}

                            {!loading
                                ? products.map((product) => (
                                      <TableRow
                                          key={product.id}
                                          data-state={selectedId === product.id ? "selected" : undefined}
                                          onClick={() => onSelectProduct(product)}
                                          className="cursor-pointer"
                                      >
                                          <TableCell className="max-w-[240px]">
                                              <p className="truncate font-medium">{product.name}</p>
                                              <p className="text-muted-foreground truncate text-xs">
                                                  {product.slug}
                                              </p>
                                          </TableCell>
                                          <TableCell>{product.category}</TableCell>
                                          <TableCell>{formatCurrency(product.priceCents)}</TableCell>
                                          <TableCell>
                                              <span
                                                  className={cn(
                                                      "font-medium",
                                                      Number(product.stock ?? 0) <= LOW_STOCK_THRESHOLD
                                                          ? "text-amber-600 dark:text-amber-300"
                                                          : "text-foreground",
                                                  )}
                                              >
                                                  {product.stock}
                                              </span>
                                          </TableCell>
                                          <TableCell className="text-right">
                                              <ProductStatusBadge isActive={Boolean(product.isActive)} />
                                          </TableCell>
                                      </TableRow>
                                  ))
                                : null}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
