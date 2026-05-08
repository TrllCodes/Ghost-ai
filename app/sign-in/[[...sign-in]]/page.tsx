import { SignIn } from "@clerk/nextjs";
import { Wordmark } from "@/components/editor/wordmark";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-bg-base flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 border-r border-border-default">
        <div className="mb-8">
          <Wordmark />
        </div>
        <p className="text-text-secondary text-sm mb-8">
          AI-powered collaborative system design
        </p>
        <ul className="space-y-3 text-text-muted text-sm">
          <li>Design system architectures with AI</li>
          <li>Collaborate in real-time on a shared canvas</li>
          <li>Generate technical specifications from diagrams</li>
        </ul>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <SignIn />
      </div>
    </div>
  );
}
