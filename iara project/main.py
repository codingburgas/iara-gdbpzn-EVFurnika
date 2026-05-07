import customtkinter as ctk
import webbrowser  # To open the IARA website links

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")


class IARAPortal(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("ИАРА - ИЗПЪЛНИТЕЛНА АГЕНЦИЯ ПО РИБАРСТВО И АКВАКУЛТУРИ")
        self.geometry("1100x600")

        # Layout: Sidebar (0) and Main (1)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # --- SIDEBAR ---
        self.sidebar_frame = ctk.CTkFrame(self, width=220, corner_radius=0)
        self.sidebar_frame.grid(row=0, column=0, sticky="nsew")

        self.logo_label = ctk.CTkLabel(self.sidebar_frame, text="ИАРА ПОРТАЛ", font=ctk.CTkFont(size=20, weight="bold"))
        self.logo_label.grid(row=0, column=0, padx=20, pady=30)

        # Sidebar Buttons with Actions
        self.btn_web = ctk.CTkButton(self.sidebar_frame, text="Официален Сайт", fg_color="transparent", border_width=1,
                                     command=lambda: webbrowser.open("http://iara.government.bg/"))
        self.btn_web.grid(row=1, column=0, padx=20, pady=10)

        self.btn_services = ctk.CTkButton(self.sidebar_frame, text="Електронни Услуги", command=self.show_services)
        self.btn_services.grid(row=2, column=0, padx=20, pady=10)

        self.btn_maps = ctk.CTkButton(self.sidebar_frame, text="Карта на зони", command=self.show_maps)
        self.btn_maps.grid(row=3, column=0, padx=20, pady=10)

        # Appearance Switcher at the bottom
        self.mode_menu = ctk.CTkOptionMenu(self.sidebar_frame, values=["Dark", "Light"],
                                           command=ctk.set_appearance_mode)
        self.mode_menu.grid(row=10, column=0, padx=20, pady=20, sticky="s")
        self.sidebar_frame.grid_rowconfigure(9, weight=1)  # Pushes menu to bottom

        # --- MAIN DASHBOARD ---
        self.main_view = ctk.CTkScrollableFrame(self, corner_radius=15)
        self.main_view.grid(row=0, column=1, padx=20, pady=20, sticky="nsew")

        self.header = ctk.CTkLabel(self.main_view, text="Актуална Информация", font=ctk.CTkFont(size=24, weight="bold"))
        self.header.pack(pady=20)

        # Mock News Cards
        self.add_news_card("Забрана за риболов 2026",
                           "Влиза в сила годишната забрана за улов на риба през размножителния период...")
        self.add_news_card("Нови разрешителни",
                           "Вече можете да подновите своя билет за любителски риболов изцяло онлайн.")

    def add_news_card(self, title, description):
        card = ctk.CTkFrame(self.main_view, fg_color=("gray90", "gray16"))
        card.pack(fill="x", padx=20, pady=10)

        lbl_title = ctk.CTkLabel(card, text=title, font=ctk.CTkFont(size=16, weight="bold"))
        lbl_title.pack(anchor="w", padx=15, pady=5)

        lbl_desc = ctk.CTkLabel(card, text=description, wraplength=600, justify="left")
        lbl_desc.pack(anchor="w", padx=15, pady=(0, 10))

    def show_services(self):
        self.header.configure(text="Списък с Електронни Услуги")

    def show_maps(self):
        self.header.configure(text="Интерактивна Карта на Зоните")


if __name__ == "__main__":
    app = IARAPortal()
    app.mainloop()