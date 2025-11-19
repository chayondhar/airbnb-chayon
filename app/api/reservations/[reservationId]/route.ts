import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

// Mark route as dynamic to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  context: { params: Promise<IParams> } 
) {
  try {
    const { reservationId } = await context.params; 
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!reservationId || typeof reservationId !== "string") {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.deleteMany({
      where: {
        id: reservationId,
        OR: [
          { userId: currentUser.id },
          { listing: { userId: currentUser.id } },
        ],
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error in DELETE /api/reservations/[reservationId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
