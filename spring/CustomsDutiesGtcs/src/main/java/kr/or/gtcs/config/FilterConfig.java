package kr.or.gtcs.config;

import org.sitemesh.config.ConfigurableSiteMeshFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
   
   @Bean
   public FilterRegistrationBean<ConfigurableSiteMeshFilter> siteMeshFilter(){
      FilterRegistrationBean<ConfigurableSiteMeshFilter> filter = new FilterRegistrationBean<>();
      filter.setFilter(
         ConfigurableSiteMeshFilter.create(builder -> 
            builder
               .setDecoratorPrefix("/WEB-INF/decorators/")
               .addDecoratorPath("/**", "paprika-layout.jsp")
               .addExcludedPath("/rest/**")
               .addExcludedPath("/download/**")
               .addExcludedPath("/member/**")
               .addExcludedPath("/")
               .setMimeTypes("text/html")
               .create()
         )   
      );
      filter.setOrder(100);
      filter.addUrlPatterns("/*");
      return filter;
   }
}
