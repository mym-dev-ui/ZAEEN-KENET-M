import { Route, Switch, Router as WouterRouter } from 'wouter';
import HomePage from '@/pages/home';
import ContactPage from '@/pages/contact';
import PrivacyPage from '@/pages/privacy';
import TermsPage from '@/pages/terms-conditions';

function NotFound() {
  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center bg-white p-6 text-center">
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-bold">404 - الصفحة غير موجودة</h1>
        <p className="text-gray-600">الصفحة التي تبحث عنها غير موجودة.</p>
      </div>
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms-conditions" component={TermsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;
