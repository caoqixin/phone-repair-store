import React from "react";
import { useTranslation } from "react-i18next";
import {
  Shield,
  Award,
  Clock,
  Users,
  CheckCircle,
  FileText,
  Lock,
  Loader2,
} from "lucide-react";
import { useLoaderData, useNavigation } from "react-router";
import { AboutData } from "../loader/about";

const About: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isZh = i18n.language === "zh";
  const { settings } = useLoaderData() as AboutData;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const features = [
    {
      icon: Award,
      titleKey: "about.feature_quality_title",
      descKey: "about.feature_quality_desc",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Clock,
      titleKey: "about.feature_speed_title",
      descKey: "about.feature_speed_desc",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Shield,
      titleKey: "about.feature_warranty_title",
      descKey: "about.feature_warranty_desc",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: Users,
      titleKey: "about.feature_service_title",
      descKey: "about.feature_service_desc",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const privacyPoints = [
    "about.privacy_point_1",
    "about.privacy_point_2",
    "about.privacy_point_3",
    "about.privacy_point_4",
  ];

  const termsPoints = [
    "about.term_warranty",
    "about.term_pickup",
    "about.term_payment",
    "about.term_cancellation",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t("about.title")}
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            {isZh
              ? settings.website_description_cn
              : settings.website_description_it}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Who We Are */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary-100 p-3 rounded-xl">
                <Users className="size-6 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {t("about.who_we_are")}
              </h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                {t("about.description")}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {t("about.description_detail")}
              </p>
            </div>

            {/* Company Info */}
            {(settings.address || settings.p_iva) && (
              <div className="mt-8 pt-8 border-t border-slate-100 grid md:grid-cols-2 gap-4 text-sm">
                {settings.address && (
                  <div>
                    <span className="font-semibold text-slate-700">
                      {isZh ? "地址:" : "Indirizzo:"}
                    </span>
                    <p className="text-slate-600">{settings.address}</p>
                  </div>
                )}
                {settings.p_iva && (
                  <div>
                    <span className="font-semibold text-slate-700">P.IVA:</span>
                    <p className="text-slate-600 font-mono">{settings.p_iva}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            {t("about.why_choose_us")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div
                  className={`${feature.bg} ${feature.color} size-14 rounded-xl flex items-center justify-center mb-4`}
                >
                  <feature.icon className="size-7" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Lock className="size-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {t("about.privacy")}
              </h2>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <p className="text-slate-700 leading-relaxed">
                {t("about.privacy_text")}
              </p>
            </div>
            <div className="space-y-3">
              {privacyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-slate-600">{t(point)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Terms & Conditions */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-3 rounded-xl">
                <FileText className="size-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {t("about.terms")}
              </h2>
            </div>
            <div className="space-y-4">
              {termsPoints.map((term, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100"
                >
                  <div className="bg-white size-8 rounded-full flex items-center justify-center shrink-0 font-bold text-primary-600 border-2 border-primary-200">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 pt-1">{t(term)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-linear-to-br from-primary-600 to-primary-700 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            {isZh ? "还有疑问?" : "Hai domande?"}
          </h3>
          <p className="text-primary-100 text-lg mb-8">
            {isZh
              ? "我们随时准备帮助您解决任何问题"
              : "Siamo sempre pronti ad aiutarti con qualsiasi domanda"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-primary-600 hover:bg-slate-50 px-8 py-3 rounded-lg font-bold transition-all shadow-lg inline-block"
            >
              {t("nav.contact")}
            </a>
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/ /g, "")}`}
                className="bg-primary-800 hover:bg-primary-900 text-white px-8 py-3 rounded-lg font-bold transition-all inline-block"
              >
                {settings.phone}
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
