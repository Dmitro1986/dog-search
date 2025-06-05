/** @format */

"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Card className="border-red-500 bg-red-50 mb-4">
      <CardContent>
        <h2 className="text-red-700 font-semibold mb-2">Ошибка</h2>
        <p className="text-red-600">{message}</p>
      </CardContent>
    </Card>
  );
}
