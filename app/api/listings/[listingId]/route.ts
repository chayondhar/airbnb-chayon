import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// Mark route as dynamic to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<IParams> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { listingId } = await params;

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.deleteMany({
      where: {
        id: listingId,
        userId: currentUser.id,
      },
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error in DELETE /api/listings/[listingId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}