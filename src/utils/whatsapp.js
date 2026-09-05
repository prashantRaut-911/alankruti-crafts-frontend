export function openWhatsApp(
  message
) {

  const number =
    import.meta.env
      .VITE_WHATSAPP_NUMBER;

  if (!number) {

    console.error(
      "WhatsApp number is not configured."
    );

    return;

  }

  const url =
    `https://wa.me/${number}?text=${encodeURIComponent(
      message
    )}`;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}

export function createOrderMessage(
  order
) {

  const items =
    order.items
      ?.map(
        item =>
          `${item.name} × ${item.quantity}`
      )
      .join("\n");

  return `
Hello Alankruti Crafts 👋

I would like to confirm my order.

Order:
#${order.orderNumber || order._id}

Items:
${items}

Total:
₹${order.totalAmount}

Customer:
${order.customer?.name || ""}

Phone:
${order.customer?.phone || ""}

Thank you.
`.trim();

}