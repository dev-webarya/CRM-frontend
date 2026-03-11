import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader, Receipt, Wallet } from "lucide-react";
import { invoiceAPI, payrollAPI } from "@/lib/api";
import { formatCurrency } from "@/lib/crmUtils";

type PayrollRecord = any;
type InvoiceRecord = any;

function getDefaultBillingMonth() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export default function BillingCenter() {
  const [billingMonth, setBillingMonth] = useState(getDefaultBillingMonth());
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [loadingPayroll, setLoadingPayroll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [generatedInvoices, setGeneratedInvoices] = useState<InvoiceRecord[]>([]);
  const [generatedPayrolls, setGeneratedPayrolls] = useState<PayrollRecord[]>([]);

  const invoiceTotals = useMemo(() => {
    const total = generatedInvoices.reduce((sum, inv: any) => sum + Number(inv.totalAmount || 0), 0);
    const outstanding = generatedInvoices.reduce((sum, inv: any) => sum + Number(inv.remainingAmount || 0), 0);
    return { total, outstanding };
  }, [generatedInvoices]);

  const payrollTotals = useMemo(() => {
    const net = generatedPayrolls.reduce((sum, p: any) => sum + Number(p.netAmount || 0), 0);
    const hours = generatedPayrolls.reduce((sum, p: any) => sum + Number(p.totalHoursTaught || 0), 0);
    return { net, hours };
  }, [generatedPayrolls]);

  const handleGenerateInvoices = async () => {
    try {
      setLoadingInvoices(true);
      setError(null);
      setSuccess(null);
      const resp = await invoiceAPI.generateMonthlyInvoices(billingMonth);
      setGeneratedInvoices(resp.data || []);
      setSuccess(`Invoices generated for ${billingMonth}.`);
    } catch (e: any) {
      console.error(e);
      setError(e?.data?.message || e?.message || "Failed to generate invoices.");
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleGeneratePayroll = async () => {
    try {
      setLoadingPayroll(true);
      setError(null);
      setSuccess(null);
      const resp = await payrollAPI.generateMonthlyPayroll(billingMonth);
      setGeneratedPayrolls(resp.data || []);
      setSuccess(`Payroll generated for ${billingMonth}.`);
    } catch (e: any) {
      console.error(e);
      setError(e?.data?.message || e?.message || "Failed to generate payroll.");
    } finally {
      setLoadingPayroll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing Center</h1>
        <p className="text-muted-foreground">
          Generate monthly invoices for students and payroll for teachers using real attendance/class data.
        </p>
      </div>

      {(error || success) && (
        <Alert variant={error ? "destructive" : "default"}>
          <AlertDescription>{error || success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Generate</CardTitle>
          <CardDescription>Select the billing month (YYYY-MM).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xs">
            <label className="text-sm font-medium">Billing Month</label>
            <Input
              type="month"
              value={billingMonth}
              onChange={(e) => setBillingMonth(e.target.value)}
              className="mt-2"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleGenerateInvoices} disabled={loadingInvoices || loadingPayroll} className="gap-2">
              {loadingInvoices ? <Loader className="h-4 w-4 animate-spin" /> : <Receipt className="h-4 w-4" />}
              Generate Invoices
            </Button>
            <Button
              variant="secondary"
              onClick={handleGeneratePayroll}
              disabled={loadingInvoices || loadingPayroll}
              className="gap-2"
            >
              {loadingPayroll ? <Loader className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
              Generate Payroll
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generated Invoices</CardTitle>
            <CardDescription>
              Count: {generatedInvoices.length} · Total: {formatCurrency(invoiceTotals.total)} · Outstanding:{" "}
              {formatCurrency(invoiceTotals.outstanding)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedInvoices.length === 0 ? (
              <div className="text-sm text-muted-foreground">No invoices generated yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">Invoice</th>
                      <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">Student</th>
                      <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">Amount</th>
                      <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {generatedInvoices.map((inv: any) => (
                      <tr key={inv._id}>
                        <td className="p-3 font-mono text-xs">{inv.invoiceNumber || inv._id}</td>
                        <td className="p-3 text-sm">{inv.student?.name || inv.student}</td>
                        <td className="p-3 text-sm">{formatCurrency(inv.totalAmount || 0)}</td>
                        <td className="p-3 text-sm capitalize">{inv.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Payroll</CardTitle>
            <CardDescription>
              Count: {generatedPayrolls.length} · Hours: {payrollTotals.hours.toFixed(1)} · Net:{" "}
              {formatCurrency(payrollTotals.net)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedPayrolls.length === 0 ? (
              <div className="text-sm text-muted-foreground">No payroll generated yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">Month</th>
                      <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">Teacher</th>
                      <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">Hours</th>
                      <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">Net</th>
                      <th className="p-3 text-xs font-semibold uppercase text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {generatedPayrolls.map((p: any) => (
                      <tr key={p._id}>
                        <td className="p-3 text-sm font-mono">{p.billingMonth}</td>
                        <td className="p-3 text-sm">{p.teacher?.name || p.teacher}</td>
                        <td className="p-3 text-sm">{Number(p.totalHoursTaught || 0).toFixed(1)}</td>
                        <td className="p-3 text-sm">{formatCurrency(p.netAmount || 0)}</td>
                        <td className="p-3 text-sm capitalize">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

