import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb"
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
            listingId,
            startDate,
            endDate,
            totalPrice
        } = body;

        if (!listingId || !startDate || !endDate || !totalPrice) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const listingAndReservation = await prisma.listing.update({
            where: {
                id: listingId
            },
            data: {
                reservations: {
                    create: {
                        userId: currentUser.id,
                        startDate,
                        endDate,
                        totalPrice
                    }
                }
            }
        });

        return NextResponse.json(listingAndReservation);
    } catch (error) {
        console.error('Error in POST /api/reservations:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

