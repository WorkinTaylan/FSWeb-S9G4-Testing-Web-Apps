import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';
import App from "../App";


test('hata olmadan render ediliyor', () => {
    render(<App/>);
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu/>);
    const baslik=screen.getByText(/İletişim Formu/i);
    expect(baslik).toBeInTheDocument();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu/>);
    const inputAd=screen.getByPlaceholderText(/İlhan/i);
    userEvent.type(inputAd, "İlha");
    expect(await screen.findByTestId("error")).toBeVisible();
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);
    userEvent.click(screen.getByRole("button"));
    expect(await screen.findAllByTestId("error")).toHaveLength(3);
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);
    const inputA=screen.getByPlaceholderText(/İlhan/i);
    userEvent.type(inputA, "İlhan");
    
    const inputB=screen.getByPlaceholderText(/Mansız/i);
    userEvent.type(inputB, "Mansız");
    
    userEvent.click(screen.getByRole("button"));
    expect(await screen.findByTestId("error")).toBeVisible();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);
    const inputAd= screen.getByPlaceholderText(/İlhan/i);
    userEvent.type(inputAd, "Taylan");

    const inputSoyAd= screen.getByPlaceholderText(/Mansız/i);
    userEvent.type(inputSoyAd, "Taytay");

    const inputMail= screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
    userEvent.type(inputMail, "taytay@bombabombacom");

    userEvent.click(screen.getByRole("button"));
    expect(await screen.findByTestId("error")).toBeVisible();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);
    const adInput=screen.getByPlaceholderText(/İlhan/i);
    userEvent.type(adInput, "İlhan");

    const mailInput=screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
    userEvent.type(mailInput, "yüzyılıngolcüsü@hotmail.com");

    userEvent.click(screen.getByRole("button"));
    expect(await screen.findByTestId("error")).toBeVisible();

});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu/>);
    const adInput=screen.getByPlaceholderText(/İlhan/i);
    userEvent.type(adInput, "İlhan");

    const soyAd=screen.getByPlaceholderText(/Mansız/i);
    userEvent.type(soyAd, "Mansız");

    const email=screen.getByPlaceholderText(/yüzyılıngolcüsü@hotmail.com/i);
    userEvent.type(email, "yüzyılıngolcüsü@hotmail.com");

    const submitBtn=screen.getByText(/Gönder/i);
    userEvent.click(submitBtn);
    await waitFor(()=>{
        const errorAlanı=screen.queryAllByTestId("error");
        expect(errorAlanı.length).toBe(0);
    }, {timeOut:4000}); //ekranda 4s popup görmeliyim
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu/>);

    userEvent.type(screen.getByPlaceholderText("İlhan"),"Ahmet");
    userEvent.type(screen.getByPlaceholderText("Mansız"),"Developer");
    userEvent.type(
        screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
        "ahmet@dev.com"
    );

    userEvent.type(screen.getByText("Mesaj"), "tamamlandı");
    userEvent.click(screen.getByRole("button"));
    expect(await screen.findByTestId("firstnameDisplay")).toHaveTextContent("Ahmet");

    expect(await screen.findByTestId("lastnameDisplay")).toHaveTextContent("Developer");
    expect(await screen.findByTestId("emailDisplay")).toHaveTextContent("ahmet@dev.com");
    expect(await screen.findByTestId("messageDisplay")).toHaveTextContent("tamamlandı");


});

