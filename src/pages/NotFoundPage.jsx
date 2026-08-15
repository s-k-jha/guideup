import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Seo from '../lib/seo'
import { Container } from '../components/layout/PageContainer'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found" path="/404" noindex />
      <Container className="py-28 text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mb-6">
          <Compass className="w-6 h-6 text-primary-600" />
        </div>
        <h1 className="text-h1 font-display text-foreground mb-3">Lost your way?</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          The page you're looking for doesn't exist or may have moved. Let's get you back on track.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/sessions">Explore Sessions</Link>
          </Button>
        </div>
      </Container>
    </>
  )
}
