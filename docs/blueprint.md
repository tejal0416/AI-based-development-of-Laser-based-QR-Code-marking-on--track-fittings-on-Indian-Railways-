# **App Name**: RailWatch

## Core Features:

- User Authentication: Secure user login and logout functionality using JWT.
- QR Code Scanning: Scan QR codes using the device's camera to identify rail parts.
- Part Information Retrieval: Retrieve rail part information from the local database after a successful QR code scan.
- Local Data Storage: Store rail part, vendor, and inspection data locally using SQLite.
- Inspection Summary Generation: AI tool: After QR code scanning, use LLM to evaluate the scan data from the local database. Produce an intelligent plain-language summary, to help users decide whether an inspection is needed for the given part.
- Offline Availability: Access part information and perform scans even without an active internet connection.
- Error Handling: Display user-friendly error messages and provide retry options in case of failures.

## Style Guidelines:

- Primary color: Steel Blue (#4682B4) to reflect the industrial nature of rail fittings.
- Background color: Light Gray (#D3D3D3) for a clean and neutral backdrop.
- Accent color: Burnt Orange (#CC6633) to highlight important actions and information.
- Body font: 'PT Sans', sans-serif, for clear readability of part descriptions and data.
- Headline font: 'Space Grotesk', sans-serif, for titles and headers throughout the application.
- Use simple, geometric icons to represent different rail part categories and actions.
- Maintain a clean and consistent layout across all screens, using clear spacing and alignment.