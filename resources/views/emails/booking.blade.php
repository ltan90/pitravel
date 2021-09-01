<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body>
<style>
    @media only screen and (max-width: 600px) {
        .inner-body {
            width: 100% !important;
        }

        .footer {
            width: 100% !important;
        }
    }

    @media only screen and (max-width: 500px) {
        .button {
            width: 100% !important;
        }
    }
</style>
<div style="width: 600px; margin: 0 auto; border: 1px solid #ccc; padding: 25px;">
    <p>
        {{ trans('emails.header.p1') }}<br/>
        {{ trans('emails.header.p2') . trans('emails.contact.title') }}<br/>
        {{ trans('emails.header.p3') }}<br/>
        {{ trans('emails.header.p4') }}
    </p>
    <div>
        <h4 style="color: rgb(77, 146, 0); font-weight: bold; margin-top: 50px !important; font-size: 18px; padding-left: 5px;">{{ trans('emails.customer.title') }}</h4>
        <div style="border:none;">
            <ul style="padding-left: 0px;margin-top: 0px;margin-bottom: 0px;">
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.customer.name') }}</span>
                    <span style="font-size: 14px; color: #5e6d77; display: inline-block;">{{ $booking->customer->full_name }}</span>
                </li>
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.customer.phone') }}</span>
                    <span style="font-size: 14px; color: #5e6d77; display: inline-block;">{{ $booking->customer->phone }}</span>
                </li>
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.customer.email') }}</span>
                    <span style="font-size: 14px; color: #5e6d77; display: inline-block;">{{ $booking->customer->email }}</span>
                </li>
            </ul>
        </div>
        <h4 style="color: rgb(77, 146, 0); font-weight: bold; margin-top: 30px !important; font-size: 18px; padding-left: 5px;">{{ trans('emails.service.title') }}</h4>
        <div style="border:none;">
            <ul style="padding-left: 0px;margin-top: 0px;margin-bottom: 0px;">
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.service.booking.hotel') }}</span>
                    <span style="font-size: 14px; color: #5e6d77; display: inline-block;">{{ $booking->hotel->name }}</span>
                </li>
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.service.booking.code') }}</span>
                    <span style="font-size: 14px; color: #5e6d77; display: inline-block;">{{ $booking->code }}</span>
                </li>
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.service.booking.arrival_date') }}</span>
                    <span style="font-size: 14px; color: #ee0000; display: inline-block;">{{ \Carbon\Carbon::parse($booking->arrival_date)->format(config('settings.format.date')) }}</span>
                </li>
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.service.booking.departure_date') }}</span>
                    <span style="font-size: 14px; color: #5e6d77; display: inline-block;">{{ \Carbon\Carbon::parse($booking->departure_date)->format(config('settings.format.date')) }}</span>
                </li>
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.service.booking.adults') }}</span>
                    <span style="font-size: 14px; color: #5e6d77; display: inline-block;">{{ $booking->adults }}</span>
                </li>
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.service.booking.children') }}</span>
                    <span style="font-size: 14px; color: #5e6d77; display: inline-block;">{{ $booking->children }}</span>
                </li>
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.service.booking.rooms') }}</span>
                    <span style="font-size: 14px; color: #ee0000; display: inline-block;">{{ $booking->rooms }}</span>
                </li>
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.service.booking.note') }}</span>
                    <span style="font-size: 14px; color: #ee0000; display: inline-block;">{{ $booking->note }}</span>
                </li>
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.service.booking.is_business') }}</span>
                    <span style="font-size: 14px; color: #ee0000; display: inline-block;">{{ $booking->is_bussiness ? 'Có' : 'Không' }}</span>
                </li>
                <li style="padding:5px;margin:0px;list-style:none;border-bottom: 1px dashed #dae1e7;display:list-item">
                    <span style="font-weight:bold;width: 38%;display: inline-block;">{{ trans('emails.service.booking.created_at') }}</span>
                    <span style="font-size: 14px; color: #ee0000; display: inline-block;">{{ \Carbon\Carbon::parse($booking->created_at)->format(config('settings.format.date')) }}</span>
                </li>
            </ul>
        </div>
    </div>
    <h1 style="margin-top: 30px;"><span style="border-bottom: 1px dashed #000; padding-bottom: 5px; color: #eb7629; font-size: 24px;">{{ trans('emails.contact.title') }}</span></h1>
    <p>
        <b>{{ trans('emails.contact.address') }}</b><br/>
        <b>{{ trans('emails.contact.phone') }}</b><br/>
        <b>{{ trans('emails.contact.email') }}</b><br/>
        <b>{{ trans('emails.contact.website') }}</b><br/>
    </p>
</div>
</body>
</html>
