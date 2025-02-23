import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Pencil, Eye, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  listarFornecedores,
  cadastrarFornecedor,
  atualizarFornecedor,
  excluirFornecedor,
} from "@/services/FornecedorService";

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFornecedor, setCurrentFornecedor] = useState(null);
  const [formData, setFormData] = useState({ nome: "", telefone: "", email: "" });

  const fetchFornecedores = useCallback(async () => {
    try {
      const data = await listarFornecedores();
      setFornecedores(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os fornecedores.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFornecedores();
  }, [fetchFornecedores]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentFornecedor) {
        await atualizarFornecedor(currentFornecedor.id, formData.nome, formData.telefone, formData.email);
        toast({
          title: "Sucesso",
          description: "Fornecedor atualizado com sucesso.",
        });
      } else {
        await cadastrarFornecedor(formData.nome, formData.telefone, formData.email);
        toast({
          title: "Sucesso",
          description: "Fornecedor cadastrado com sucesso.",
        });
      }
      fetchFornecedores();
      setIsDialogOpen(false);
      setCurrentFornecedor(null);
      setFormData({ nome: "", telefone: "", email: "" });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o fornecedor.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este fornecedor?")) return;
    try {
      await excluirFornecedor(id);
      toast({
        title: "Sucesso",
        description: "Fornecedor excluído com sucesso.",
      });
      fetchFornecedores();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o fornecedor.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (fornecedor) => {
    setCurrentFornecedor(fornecedor);
    setFormData({ nome: fornecedor.nome, telefone: fornecedor.telefone, email: fornecedor.email });
    setIsDialogOpen(true);
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto py-10">
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Fornecedor
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fornecedores.map((fornecedor) => (
            <TableRow key={fornecedor.id}>
              <TableCell>{fornecedor.nome}</TableCell>
              <TableCell>{fornecedor.telefone}</TableCell>
              <TableCell>{fornecedor.email}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(fornecedor.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(fornecedor)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentFornecedor ? "Editar" : "Adicionar"} Fornecedor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <Input
                id="nome"
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
              <Input
                id="telefone"
                placeholder="Telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
              <Input
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fornecedores;