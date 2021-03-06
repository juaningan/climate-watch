module Api
  module V1
    module Data
      module NdcSdg
        class Filter
          include Api::V1::Data::SanitisedSorting
          include Api::V1::Data::ColumnHelpers
          include Api::V1::Data::NdcSdg::FilterColumns

          attr_reader :status, :climate_response, :type_of_information

          # @param params [Hash]
          # @option params [Array<String>] :countries
          # @option params [Array<Integer>] :goal_ids
          # @option params [Array<Integer>] :target_ids
          # @option params [Array<Integer>] :sector_ids
          # @option params [String] :sort_col
          # @option params [String] :sort_dir
          def initialize(params)
            initialize_filters(params)
            initialise_sorting(params[:sort_col], params[:sort_dir])
            @query = ::NdcSdg::NdcTargetSector.
              joins(:sector, ndc_target: [{ndc: :location}, {target: :goal}])
          end

          def call
            dict_columns = [:status, :climate_response, :type_of_information]
            dict_query = @query.select(
              dict_columns.map { |column| "INITCAP(#{column}) AS #{column}" }
            )
            @dict = Hash[dict_columns.map do |column|
              [column, dict_query.map(&column).compact.uniq.sort]
            end]
            apply_filters
            @query.
              select(select_columns).
              order(sanitised_order)
          end

          def meta
            @dict.merge(sorting_manifest).merge(column_manifest)
          end

          private

          def initialize_filters(params)
            # integer arrays
            [:goal_ids, :target_ids, :sector_ids].map do |param_name|
              if params[param_name].present? && params[param_name].is_a?(Array)
                value = params[param_name].map(&:to_i)
              end
              instance_variable_set(:"@#{param_name}", value)
            end
            @countries = params[:countries]
            @status = params[:status]
            @climate_response = params[:climate_response]
            @type_of_information = params[:type_of_information]
          end

          def apply_filters
            apply_location_filter
            apply_status_filter
            apply_climate_response_filter
            apply_type_of_information_filter

            # rubocop:disable Style/IfUnlessModifier
            if @goal_ids
              @query = @query.where('ndc_sdg_targets.goal_id' => @goal_ids)
            end
            # rubocop:enable Style/IfUnlessModifier
            if @target_ids
              @query = @query.where(
                'ndc_sdg_ndc_targets.target_id' => @target_ids
              )
            end
            @query = @query.where(sector_id: @sector_ids) if @sector_ids
          end

          def apply_location_filter
            return unless @countries
            @query = @query.where(
              'locations.iso_code3' => @countries
            )
          end

          def apply_status_filter
            return unless status
            @query = @query.where('ndc_sdg_ndc_targets.status' => status)
          end

          def apply_climate_response_filter
            return unless climate_response
            @query = @query.where('ndc_sdg_ndc_targets.climate_response' => climate_response)
          end

          def apply_type_of_information_filter
            return unless type_of_information
            @query = @query.where('ndc_sdg_ndc_targets.type_of_information' => type_of_information)
          end
        end
      end
    end
  end
end
