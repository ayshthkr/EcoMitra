"use client";

import { useState } from "react";
import {
  DollarSign,
  Building2,
  CreditCard,
  Wallet,
  MoreHorizontal,
  Loader2,
  LucideIcon,
  IndianRupee,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { updateBankAccount } from "@/actions/banking/update-bank-account";
import { deleteBankAccount } from "@/actions/banking/delete-bank-account";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AccountType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BankAccountSelectorProps {
  data: {
    bankAccounts: {
      id: string;
      name: string;
      type: string;
      balance: number;
      percentage: number;
      accountNumber?: string;
      lastTransaction?: {
        amount: number;
        date: Date;
        description: string;
      };
    }[];
  };
}

const iconMap = {
  BANK: Building2,
  INVESTMENT: CreditCard,
  CRYPTO: Wallet,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const updateBankAccountSchema = z.object({
  id: z.string().min(1, "Account ID is required"),
  name: z.string().min(2, "Account name must be at least 2 characters."),
  accountType: z.enum(["BANK", "SAVINGS", "INVESTMENT", "CRYPTO"]),
  description: z.string().optional(),
});

type UpdateBankAccountSchema = z.infer<typeof updateBankAccountSchema>;

function formatAccountDisplay(name: string, accountNumber: string) {
  const lastFour = accountNumber.slice(-4);
  return {
    name,
    displayNumber: `****${lastFour}`,
  };
}

// Add a helper function to get the appropriate icon
function getAccountIcon(type: AccountType): LucideIcon {
  switch (type) {
    case AccountType.SAVINGS:
      return Wallet;
    case AccountType.BANK:
    default:
      return Building2;
  }
}

export default function BankAccountSelector({
  data,
}: BankAccountSelectorProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<{
    id: string;
    name: string;
    type: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateBankAccountSchema>({
    defaultValues: {
      name: "",
      accountType: "BANK",
      description: "",
    },
  });

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking actions
  };

  const handleUpdateAccount = async (account: {
    id: string;
    name: string;
    type: string;
  }) => {
    try {
      const result = await updateBankAccount({
        id: account.id,
        name: account.name,
        accountType: account.type as "BANK" | "CRYPTO" | "INVESTMENT",
      });

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success("Account updated successfully");
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Failed to update account");
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      setIsDeleting(true);
      const result = await deleteBankAccount({ id: accountId });

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (account: {
    id: string;
    name: string;
    type: string;
  }) => {
    setSelectedAccount(account);
    form.reset({
      id: account.id,
      name: account.name,
      accountType: account.type as "BANK" | "CRYPTO" | "INVESTMENT",
    });
    setEditDialogOpen(true);
  };

  const onSubmit = async (data: UpdateBankAccountSchema) => {
    try {
      setIsSubmitting(true);
      const result = await updateBankAccount(data);

      if (!result.success) {
        throw new Error(result.error as string);
      }

      toast.success("Account updated successfully");
      setEditDialogOpen(false);
      setSelectedAccount(null);
      form.reset();
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Failed to update account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Your Bank Accounts</CardTitle>
          <CardDescription>
            Manage and monitor all your financial accounts in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {data.bankAccounts.map((account) => {
              const Icon = getAccountIcon(account.type as AccountType);
              return (
                <div
                  key={account.id}
                  className="flex items-center space-x-4 rounded-md border p-4"
                >
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/banking/${account.id}`}
                        className="text-sm font-medium leading-none hover:underline"
                      >
                        {account.name}
                      </Link>
                      {account.accountNumber && (
                        <span className="text-sm text-muted-foreground">
                          {
                            formatAccountDisplay(
                              account.name,
                              account.accountNumber
                            ).displayNumber
                          }
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {account.type.charAt(0) +
                        account.type.slice(1).toLowerCase()}
                    </p>
                    {account.lastTransaction && (
                      <p className="text-xs text-muted-foreground">
                        Last updated:{" "}
                        {formatDistanceToNow(account.lastTransaction.date, {
                          addSuffix: true,
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          account.balance < 0 && "text-destructive"
                        )}
                      >
                        {account.balance.toLocaleString("en-US", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </span>
                    </div>
                    <div onClick={handleActionClick}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link
                              href={`/banking/${account.id}`}
                              className="flex w-full"
                            >
                              View Transactions
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(account)}
                          >
                            Edit Account
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteAccount(account.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Removing...
                              </>
                            ) : (
                              "Remove Account"
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        {/* CardFooter with account selection info removed */}
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value: AccountType) =>
                          field.onChange(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AccountType.BANK}>
                            Checking Account
                          </SelectItem>
                          <SelectItem value={AccountType.SAVINGS}>
                            Savings Account
                          </SelectItem>
                          <SelectItem value={AccountType.INVESTMENT}>
                            Investment Account
                          </SelectItem>
                          <SelectItem value={AccountType.CRYPTO}>
                            Crypto Account
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter account description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditDialogOpen(false);
                    setSelectedAccount(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
