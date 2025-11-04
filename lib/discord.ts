/**
 * 🔔 إرسال إشعارات Discord عند حدوث دفعات جديدة
 */

export interface DiscordNotificationData {
  paymentId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'refunded' | 'pending';
  customerEmail?: string;
  customerName?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

/**
 * إرسال إشعار إلى Discord
 */
export async function sendDiscordNotification(data: DiscordNotificationData): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('⚠️ Discord webhook URL not configured');
    return false;
  }

  try {
    // اختيار اللون حسب حالة الدفع
    const colors = {
      succeeded: 0x00ff00,  // أخضر
      failed: 0xff0000,     // أحمر
      refunded: 0xffa500,   // برتقالي
      pending: 0xffff00     // أصفر
    };

    // اختيار الإيموجي حسب الحالة
    const emojis = {
      succeeded: '✅',
      failed: '❌',
      refunded: '🔄',
      pending: '⏳'
    };

    // اختيار العنوان حسب الحالة
    const titles = {
      succeeded: 'دفعة جديدة ناجحة!',
      failed: 'فشلت عملية الدفع',
      refunded: 'تم استرجاع المبلغ',
      pending: 'دفعة قيد الانتظار'
    };

    // تنسيق المبلغ
    const formattedAmount = `${data.amount.toFixed(2)} ${data.currency}`;

    // تنسيق قائمة المنتجات
    let itemsText = '';
    if (data.items && data.items.length > 0) {
      itemsText = data.items
        .map(item => `• ${item.name} (x${item.quantity}) - ${item.price} ${data.currency}`)
        .join('\n');
    }

    // بناء الرسالة
    const embed = {
      title: `${emojis[data.status]} ${titles[data.status]}`,
      color: colors[data.status],
      fields: [
        {
          name: '💰 المبلغ',
          value: formattedAmount,
          inline: true
        },
        {
          name: '🆔 رقم الدفعة',
          value: `\`${data.paymentId}\``,
          inline: true
        },
        {
          name: '📊 الحالة',
          value: data.status,
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'LEVEL UP Store'
      }
    };

    // إضافة معلومات العميل إذا كانت متوفرة
    if (data.customerName || data.customerEmail) {
      embed.fields.push({
        name: '👤 العميل',
        value: `${data.customerName || 'غير محدد'}\n${data.customerEmail || ''}`,
        inline: false
      });
    }

    // إضافة قائمة المنتجات إذا كانت متوفرة
    if (itemsText) {
      embed.fields.push({
        name: '🛍️ المنتجات',
        value: itemsText,
        inline: false
      });
    }

    // إرسال الإشعار
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });

    if (!response.ok) {
      console.error('❌ Failed to send Discord notification:', response.statusText);
      return false;
    }

    console.log('✅ Discord notification sent successfully');
    return true;

  } catch (error: any) {
    console.error('❌ Error sending Discord notification:', error.message);
    return false;
  }
}

/**
 * إرسال إشعار بسيط إلى Discord (نص فقط)
 */
export async function sendSimpleDiscordMessage(message: string): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('⚠️ Discord webhook URL not configured');
    return false;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message
      })
    });

    if (!response.ok) {
      console.error('❌ Failed to send Discord message:', response.statusText);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error('❌ Error sending Discord message:', error.message);
    return false;
  }
}

