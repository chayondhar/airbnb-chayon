import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// Mark route as dynamic to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
    request: Request
) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount,
            guestCount,
            location,
            price
        } = body;

        // Validate required fields
        if (!title || !description || !imageSrc || !category || 
            !roomCount || !bathroomCount || !guestCount || !location || !price) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const listing = await prisma.listing.create({
            data: {
                title,
                description,
                imageSrc,
                category,
                roomCount,
                bathroomCount,
                guestCount,
                locationValue: location.value,
                price: parseInt(price, 10),
                userId: currentUser.id
            }
        });

        return NextResponse.json(listing);
    } catch (error) {
        console.error('Error in POST /api/listings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}