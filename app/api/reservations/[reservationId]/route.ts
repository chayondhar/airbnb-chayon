import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  context: { params: Promise<IParams> } 
) {
  const { reservationId } = await context.params; 
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  if (!reservationId || typeof reservationId !== "string") {
    throw new Error("Invalid ID");
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
}
