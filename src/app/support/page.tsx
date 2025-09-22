import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SupportPage() {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Support</CardTitle>
          <CardDescription>
            Get help with RailWatch or contact our support team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Frequently Asked Questions</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>How do I scan a new part?</li>
            <li>Where can I see the inspection history?</li>
            <li>How do I update my account settings?</li>
          </ul>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <p>
              If you need further assistance, please email us at{" "}
              <a href="mailto:support@railwatch.com" className="underline text-primary">
                support@railwatch.com
              </a>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
