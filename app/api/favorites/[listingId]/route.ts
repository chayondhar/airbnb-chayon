import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// Mark route as dynamic to prevent static generation during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface IParams {
  listingId?: string;
}

export async function POST(
  request: Request,
  context: { params: Promise<IParams> }
) {
  try {
    const { listingId } = await context.params; 
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!listingId || typeof listingId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const favoriteIds = [...(currentUser.favoriteIds || [])];

    favoriteIds.push(listingId);

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: { favoriteIds }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in POST /api/favorites/[listingId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<IParams> }
) {
  try {
    const { listingId } = await context.params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!listingId || typeof listingId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    let favoriteIds = [...(currentUser.favoriteIds || [])];
    favoriteIds = favoriteIds.filter(id => id !== listingId);

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: { favoriteIds }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in DELETE /api/favorites/[listingId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
