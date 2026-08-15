import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IndianRupee, Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { getWalletBalance, getMyWalletTransactions } from '../api/wallet'
import { useAuth } from '../context/AuthContext'
import Seo from '../lib/seo'
import { Container, Section, SectionHeading } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/States'
import WalletRechargeDialog from '../components/wallet/WalletRechargeDialog'

const TYPE_ICON = { recharge: ArrowDownCircle, debit: ArrowUpCircle, refund: ArrowDownCircle }
const TYPE_COLOR = { recharge: 'text-success', debit: 'text-foreground', refund: 'text-success' }
const STATUS_VARIANT = { completed: 'success', pending: 'warning', failed: 'destructive' }

export default function MyWalletPage() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [rechargeOpen, setRechargeOpen] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.allSettled([getWalletBalance(), getMyWalletTransactions()]).then(([b, t]) => {
      if (b.status === 'fulfilled') setBalance(b.value)
      if (t.status === 'fulfilled') setTransactions(Array.isArray(t.value) ? t.value : [])
    }).finally(() => setLoading(false))
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/talk-to-mentor'); return }
    load()
  }, [user, authLoading, navigate])

  return (
    <>
      <Seo title="My Wallet" path="/wallet" noindex />
      <Section className="pt-10 sm:pt-14">
        <Container className="max-w-2xl">
          <SectionHeading align="left" title="My Wallet" description="Recharge and track your GuideUp wallet balance." className="mb-8" />

          {loading || authLoading ? (
            <Skeleton className="h-28 rounded-xl mb-6" />
          ) : (
            <Card className="p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Current balance</div>
                  <div className="text-2xl font-display font-bold text-foreground flex items-center">
                    <IndianRupee className="w-5 h-5" />{balance}
                  </div>
                </div>
              </div>
              <Button onClick={() => setRechargeOpen(true)}>Add Money</Button>
            </Card>
          )}

          {!loading && transactions.length === 0 && (
            <EmptyState title="No transactions yet" description="Your recharges and chat payments will show up here." />
          )}

          {!loading && transactions.length > 0 && (
            <div className="space-y-2">
              {transactions.map((t) => {
                const Icon = TYPE_ICON[t.type] || Wallet
                return (
                  <Card key={t._id} className="p-4 flex items-center gap-3">
                    <Icon className={`w-5 h-5 shrink-0 ${TYPE_COLOR[t.type]}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground capitalize">{t.type}</div>
                      <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString('en-IN')}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-sm font-semibold ${t.type === 'debit' ? 'text-foreground' : 'text-success'}`}>
                        {t.type === 'debit' ? '-' : '+'}₹{t.amount}
                      </div>
                      <Badge variant={STATUS_VARIANT[t.status]} size="sm">{t.status}</Badge>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </Container>
      </Section>

      <WalletRechargeDialog open={rechargeOpen} onOpenChange={setRechargeOpen} onSuccess={() => { setRechargeOpen(false); load() }} />
    </>
  )
}
