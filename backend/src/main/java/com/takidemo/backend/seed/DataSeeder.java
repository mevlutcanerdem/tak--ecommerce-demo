package com.takidemo.backend.seed;

import com.takidemo.backend.entity.Category;
import com.takidemo.backend.entity.Product;
import com.takidemo.backend.repository.CategoryRepository;
import com.takidemo.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Seeds the demo catalog on startup so the frontend has real data to render against from
 * day one. Runs only when the database is empty (idempotent) and is disabled in the "test"
 * profile so integration tests control their own fixtures.
 */
@Slf4j
@Component
@Profile("!test")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    private static final String UNSPLASH = "https://images.unsplash.com/photo-";
    private static final String PARAMS = "?w=800&q=80";

    @Override
    @Transactional
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            log.info("Seed data already present, skipping seeding.");
            return;
        }

        Category rings = category("Yüzükler", "yuzukler", img("1720093601709-66ce9c0068a1"));
        Category necklaces = category("Kolyeler", "kolyeler", img("1721103418939-5112f0ccfac8"));
        Category earrings = category("Küpeler", "kupeler", img("1653227907877-e097195908fb"));
        Category bracelets = category("Bileklikler", "bileklikler", img("1585711715631-1e6bf224f092"));

        categoryRepository.saveAll(List.of(rings, necklaces, earrings, bracelets));

        List<Product> products = List.of(
                // Yüzükler
                product("Zarif Pırlanta Tektaş Yüzük", "zarif-pirlanta-tektas-yuzuk",
                        "Işıltılı tek taş pırlantası ve zarif beyaz altın bandıyla özel anlarınız için tasarlandı. "
                                + "Nişan ve söz törenlerinin vazgeçilmezi.",
                        new BigDecimal("8999.90"), new BigDecimal("7499.90"), "18 Ayar Beyaz Altın",
                        8, 4.9, true, false, rings,
                        img("1561812350-932aed735105"), img("1731586249471-82bb9b2f769a")),
                product("Klasik Alyans Çifti Modeli", "klasik-alyans-cifti-modeli",
                        "Sadeliğin zarafetle buluştuğu klasik alyans modeli. Günlük kullanıma uygun, "
                                + "zamansız bir tasarım.",
                        new BigDecimal("3499.90"), null, "14 Ayar Sarı Altın",
                        20, 4.7, false, false, rings,
                        img("1626784214536-d859187e0bd0"), img("1543294001-f7cd5d7fb516")),
                product("Modern Solitaire Yüzük", "modern-solitaire-yuzuk",
                        "Minimal çizgileri ve parlak gümüş dokusuyla modern gardıropların favorisi.",
                        new BigDecimal("899.90"), new BigDecimal("749.90"), "925 Ayar Gümüş",
                        35, 4.5, false, true, rings,
                        img("1592317295760-5c1f677dfc78"), img("1611955167811-4711904bb9f8")),
                product("Vintage Oyma Detaylı Yüzük", "vintage-oyma-detayli-yuzuk",
                        "El işçiliği oyma detaylarıyla vintage ruhu taşıyan, rose altın kaplamalı özel tasarım.",
                        new BigDecimal("5299.90"), null, "18 Ayar Rose Altın",
                        12, 4.8, true, false, rings,
                        img("1589207212797-cfd546dea0fe"), img("1629118639934-2b241503956c")),
                product("Minimal İnce Bant Yüzük", "minimal-ince-bant-yuzuk",
                        "İnce ve narin bandıyla tek başına ya da katmanlı kombinlerde şıklık katan günlük yüzük.",
                        new BigDecimal("649.90"), null, "925 Ayar Gümüş",
                        50, 4.4, false, true, rings,
                        img("1727784635912-6f6e95d2f66a"), img("1567523977592-7959bc5df51e")),

                // Kolyeler
                product("Altın Kalp Kolye", "altin-kalp-kolye",
                        "Zarif kalp formuyla sevgi dolu bir hediye arayanlar için özenle tasarlandı. "
                                + "18 ayar altın işçiliğiyle uzun yıllar parlaklığını korur.",
                        new BigDecimal("1499.90"), new BigDecimal("1199.90"), "18 Ayar Altın",
                        12, 4.8, true, false, necklaces,
                        img("1601121141461-9d6647bca1ed"), img("1601121141418-c1caa10a2a0b")),
                product("İnci Detaylı Zincir Kolye", "inci-detayli-zincir-kolye",
                        "İnce zincir üzerine yerleştirilmiş doğal inci detayıyla şık ve feminen bir tasarım.",
                        new BigDecimal("1899.90"), null, "14 Ayar Altın Kaplama",
                        18, 4.6, false, false, necklaces,
                        img("1611583027838-515a1087afdb"), img("1601121141461-920cb1993441")),
                product("Sonsuzluk Sembolü Kolye", "sonsuzluk-sembolu-kolye",
                        "Sonsuzluk sembolüyle bitmeyen bağların hikayesini anlatan gümüş kolye.",
                        new BigDecimal("799.90"), new BigDecimal("649.90"), "925 Ayar Gümüş",
                        25, 4.5, false, true, necklaces,
                        img("1600862754152-80a263dd564f"), img("1721206625226-c064ff8d92a7")),
                product("Katmanlı Choker Kolye", "katmanli-choker-kolye",
                        "Katmanlı tasarımıyla boyun hattını vurgulayan, günden geceye kullanılabilen choker model.",
                        new BigDecimal("2299.90"), null, "14 Ayar Altın Kaplama",
                        10, 4.7, true, false, necklaces,
                        img("1601121141499-17ae80afc03a"), img("1727947074642-0bd47ef70b58")),
                product("Zodyak Burç Kolyesi", "zodyak-burc-kolyesi",
                        "Kişiye özel burç figürüyle anlamlı ve şık bir hediye seçeneği.",
                        new BigDecimal("949.90"), null, "925 Ayar Gümüş",
                        30, 4.3, false, true, necklaces,
                        img("1721807551235-4072be6913c0"), img("1721103418312-b0057a8c31c2")),

                // Küpeler
                product("Zarif Damla Küpe", "zarif-damla-kupe",
                        "Damla formu ve ışıltılı taşlarıyla özel davetlerin gözde aksesuarı.",
                        new BigDecimal("2199.90"), new BigDecimal("1799.90"), "18 Ayar Altın",
                        15, 4.8, true, false, earrings,
                        img("1651160670627-2896ddf7822f"), img("1626784215021-2e39ccf971cd")),
                product("Pırlanta Taşlı Halka Küpe", "pirlanta-tasli-halka-kupe",
                        "İnce halka tasarımı üzerine serpiştirilmiş taşlarla modern ve zarif bir görünüm.",
                        new BigDecimal("1099.90"), null, "925 Ayar Gümüş",
                        22, 4.6, false, true, earrings,
                        img("1626784215013-13322cb0e471"), img("1589095053205-8fc842336f4a")),
                product("Sade İnci Küpe", "sade-inci-kupe",
                        "Doğal inci detayıyla her kombine uyum sağlayan zamansız bir klasik.",
                        new BigDecimal("799.90"), null, "925 Ayar Gümüş",
                        40, 4.5, false, false, earrings,
                        img("1624613673129-d5ffef60eba8"), img("1705326454933-9685fc6888e1")),
                product("Uzun Sarkıt Küpe", "uzun-sarkit-kupe",
                        "Zincir detaylarıyla hareketli ve göz alıcı bir tasarım. Özel geceler için ideal.",
                        new BigDecimal("1599.90"), null, "14 Ayar Rose Altın",
                        14, 4.7, true, false, earrings,
                        img("1701777892740-88419a701472"), img("1643387774154-4ec59518f9a5")),
                product("Mini Hoop Küpe Seti", "mini-hoop-kupe-seti",
                        "Farklı çaplarda üç adet mini hoop küpeden oluşan, katmanlı kullanıma uygun set.",
                        new BigDecimal("599.90"), null, "925 Ayar Gümüş",
                        45, 4.4, false, true, earrings,
                        img("1588891805983-fee12d508e31"), img("1705326453273-1c35d7dad309")),

                // Bileklikler
                product("Zincir Bileklik", "zincir-bileklik",
                        "İnce zincir dokusu ve parlak altın kaplamasıyla bilekleri süsleyen şık bir parça.",
                        new BigDecimal("1799.90"), new BigDecimal("1499.90"), "18 Ayar Altın",
                        16, 4.7, true, false, bracelets,
                        img("1633810543462-77c4a3b13f07"), img("1611591437281-460bfbe1220a")),
                product("Charm Detaylı Gümüş Bileklik", "charm-detayli-gumus-bileklik",
                        "Küçük charm detaylarıyla kişisel bir dokunuş katan, günlük kullanıma uygun bileklik.",
                        new BigDecimal("699.90"), null, "925 Ayar Gümüş",
                        28, 4.5, false, true, bracelets,
                        img("1611107683227-e9060eccd846"), img("1679156271456-d6068c543ee7")),
                product("Tenis Bileklik Pırlanta Taşlı", "tenis-bileklik-pirlanta-tasli",
                        "Sıra taşlarla süslenmiş, düğün ve özel davetler için göz kamaştırıcı tenis bileklik.",
                        new BigDecimal("3999.90"), new BigDecimal("3499.90"), "18 Ayar Beyaz Altın",
                        9, 4.9, true, false, bracelets,
                        img("1625908733875-efa9c75c084d"), img("1708221235482-a6e2a807198f")),
                product("Deri Örgülü Bileklik", "deri-orgulu-bileklik",
                        "Gümüş detaylarla süslenmiş örgü deri bileklik, günlük şıklık arayanlar için.",
                        new BigDecimal("549.90"), null, "Deri / 925 Ayar Gümüş",
                        33, 4.3, false, false, bracelets,
                        img("1617191880362-aac615de3c26"), img("1655707063513-a08dad26440e")),
                product("İnce Zincir Set Bileklik", "ince-zincir-set-bileklik",
                        "Üç farklı ince zincirden oluşan, katmanlı kullanım için tasarlanmış set bileklik.",
                        new BigDecimal("899.90"), null, "14 Ayar Altın Kaplama",
                        20, 4.6, false, true, bracelets,
                        img("1583484370773-c1af4e528d5e"), img("1705326452395-1d35e6add570"))
        );

        productRepository.saveAll(products);
        log.info("Seeded {} categories and {} products.", 4, products.size());
    }

    private Category category(String name, String slug, String imageUrl) {
        return Category.builder()
                .name(name)
                .slug(slug)
                .imageUrl(imageUrl)
                .build();
    }

    private Product product(String name, String slug, String description, BigDecimal price,
            BigDecimal discountPrice, String material, int stock, double rating,
            boolean featured, boolean isNew, Category category, String... images) {
        return Product.builder()
                .name(name)
                .slug(slug)
                .description(description)
                .price(price)
                .discountPrice(discountPrice)
                .material(material)
                .stock(stock)
                .rating(rating)
                .featured(featured)
                .isNew(isNew)
                .category(category)
                .images(List.of(images))
                .build();
    }

    private String img(String unsplashId) {
        return UNSPLASH + unsplashId + PARAMS;
    }
}
