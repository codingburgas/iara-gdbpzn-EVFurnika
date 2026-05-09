import customtkinter as ctk
import logic_helper as logic
import theme_config as style


class IARAGUI(ctk.CTk):
    def __init__(self):
        super().__init__()
        ctk.set_appearance_mode("dark")
        self.title("ИАРА | Fleet Management")
        self.geometry("1300x850")  # Slightly wider for bigger boxes

        # Sidebar
        self.sidebar = ctk.CTkFrame(self, width=240, corner_radius=0)
        self.sidebar.pack(side="left", fill="y")

        self.logo = ctk.CTkLabel(self.sidebar, text="⚓ ИАРА", font=style.FONT_TITLE)
        self.logo.pack(pady=40)

        self.btn_registry = ctk.CTkButton(self.sidebar, text="📦 Флотски Регистър",
                                          height=45, fg_color=style.COLOR_BRAND,
                                          text_color=("white", "black"),
                                          command=self.show_vessel_registry)
        self.btn_registry.pack(pady=10, padx=20)

        self.theme_switch = ctk.CTkSwitch(self.sidebar, text="Тъмен Режим", command=self.toggle_theme)
        self.theme_switch.select()
        self.theme_switch.pack(side="bottom", pady=20)

        # Main Area
        self.display_area = ctk.CTkScrollableFrame(self, corner_radius=0, fg_color="transparent")
        self.display_area.pack(side="right", fill="both", expand=True, padx=10, pady=10)

        self.show_vessel_registry()

    def toggle_theme(self):
        ctk.set_appearance_mode("dark" if self.theme_switch.get() == 1 else "light")

    def clear_display(self):
        for widget in self.display_area.winfo_children():
            widget.destroy()

    def show_vessel_registry(self):
        self.clear_display()

        # Header
        top_bar = ctk.CTkFrame(self.display_area, fg_color="transparent")
        top_bar.pack(fill="x", padx=30, pady=30)

        ctk.CTkLabel(top_bar, text="Регистър на корабите", font=style.FONT_TITLE).pack(side="left")

        btn_add = ctk.CTkButton(top_bar, text="+ НОВ ЗАПИС",
                                fg_color=style.COLOR_BRAND,
                                text_color=("white", "black"),
                                font=("Segoe UI", 14, "bold"), height=45,
                                command=self.show_add_vessel_form)
        btn_add.pack(side="right")

        # Grid Container
        grid_container = ctk.CTkFrame(self.display_area, fg_color="transparent")
        grid_container.pack(fill="both", expand=True, padx=20, pady=10)
        grid_container.grid_columnconfigure((0, 1), weight=1)  # Ensure columns take equal space

        vessels = logic.get_vessel_registry()
        for idx, ship in enumerate(vessels):
            self.create_vessel_card(grid_container, ship, idx)

    def create_vessel_card(self, parent, ship, idx):
        # FIX: Using the tuple color from style automatically fixes the light/dark bug
        card = ctk.CTkFrame(parent,
                            fg_color=style.COLOR_CARD_BG,
                            border_color=style.COLOR_CARD_BORDER,
                            border_width=2,
                            corner_radius=style.CORNER_RADIUS,
                            height=250)  # Set a minimum height for "Bigger" look
        card.grid(row=idx // 2, column=idx % 2, padx=20, pady=20, sticky="nsew")

        # Inner Padding Label (to push content in)
        content_frame = ctk.CTkFrame(card, fg_color="transparent")
        content_frame.pack(fill="both", expand=True, padx=25, pady=25)

        # Vessel Name
        ctk.CTkLabel(content_frame, text=ship["name"], font=style.FONT_CARD_TITLE).pack(anchor="w")

        # Separator Line (Visual Detail)
        line = ctk.CTkFrame(content_frame, height=2, fg_color=style.COLOR_CARD_BORDER)
        line.pack(fill="x", pady=15)

        # Status Badge (Adaptive)
        status_color = "#10B981" if ship["status"] == "Активен" else "#F59E0B"
        badge = ctk.CTkLabel(content_frame, text=f" ● {ship['status'].upper()}",
                             font=style.FONT_BADGE, text_color=status_color)
        badge.pack(anchor="w")

        # Details
        details = (f"🚢 CFR: {ship['cfr']}\n"
                   f"👤 Собственик: {ship['owner']}\n"
                   f"🔧 {ship['params']}")

        info_lbl = ctk.CTkLabel(content_frame, text=details, font=style.FONT_INFO,
                                justify="left", anchor="w")
        info_lbl.pack(fill="x", pady=(15, 0))

    def show_add_vessel_form(self):
        self.clear_display()
        form_container = ctk.CTkFrame(self.display_area, fg_color=style.COLOR_CARD_BG, corner_radius=20)
        form_container.pack(pady=60)

        ctk.CTkLabel(form_container, text="Нова Регистрация", font=style.FONT_TITLE).pack(pady=30, padx=60)

        self.entry_cfr = self.create_styled_input(form_container, "CFR Номер")
        self.entry_name = self.create_styled_input(form_container, "Име на плавателния съд")
        self.entry_owner = self.create_styled_input(form_container, "Собственик")
        self.entry_power = self.create_styled_input(form_container, "Мощност (HP)")

        ctk.CTkButton(form_container, text="ЗАПАЗИ В БАЗАТА",
                      fg_color=style.COLOR_BRAND, text_color=("white", "black"),
                      height=50, font=("Segoe UI", 14, "bold"),
                      command=self.handle_save).pack(pady=40, padx=60, fill="x")

        ctk.CTkButton(form_container, text="Назад", fg_color="transparent", border_width=1,
                      command=self.show_vessel_registry).pack(pady=(0, 30))

    def create_styled_input(self, parent, label):
        ctk.CTkLabel(parent, text=label, font=style.FONT_INFO).pack(anchor="w", padx=60)
        e = ctk.CTkEntry(parent, width=450, height=45, corner_radius=8)
        e.pack(pady=(5, 15), padx=60)
        return e

    def handle_save(self):
        if logic.save_vessel(self.entry_cfr.get(), self.entry_name.get(),
                             self.entry_owner.get(), self.entry_power.get()):
            self.show_vessel_registry()